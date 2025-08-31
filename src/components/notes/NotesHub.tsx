import React, { useMemo, useState } from 'react';
import { notesStorage } from '../../utils/notesStorage';
import type { NoteSection, NoteTopicId } from '../../types';
import { GlobalWorkerOptions, getDocument, version } from 'pdfjs-dist';
import { extractTextFromImage, renderPdfPageToImageDataUrl } from '../../utils/ocr';

// Configure worker (CDN fallback)
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

const TOPICS: { id: NoteTopicId; label: string }[] = [
  { id: 'flight_planning', label: 'Flight Planning' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'performance', label: 'Performance' },
  { id: 'meteorology', label: 'Meteorology' },
  { id: 'weight_balance', label: 'Weight & Balance' },
  { id: 'fuel_planning', label: 'Fuel Planning' },
  { id: 'other', label: 'Other' },
];

type Tab = 'topics' | 'import';

const NotesHub: React.FC = () => {
  const [tab, setTab] = useState<Tab>('topics');
  const [data, setData] = useState(notesStorage.load());
  const [filter, setFilter] = useState<NoteTopicId | 'all'>('all');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<string>('');

  const filtered = useMemo(() => {
    return filter === 'all' ? data.sections : data.sections.filter(s => s.topicId === filter);
  }, [data.sections, filter]);

  const handleImportPdf = async (file: File, assumedTopic: NoteTopicId = 'other') => {
    try {
      setIsImporting(true);
      setImportProgress('Loading PDF...');

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;

      const sections: NoteSection[] = [];

      for (let p = 1; p <= pdf.numPages; p++) {
        setImportProgress(`Rendering page ${p}/${pdf.numPages}...`);
        const dataUrl = await renderPdfPageToImageDataUrl(pdf, p, 2);
        setImportProgress(`Running OCR on page ${p}/${pdf.numPages}...`);
        const { text } = await extractTextFromImage(dataUrl);

        const cleaned = text
          .replace(/\s+\n/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        if (cleaned.length === 0) continue;

        sections.push({
          id: `${file.name}-p${p}-${Date.now()}`,
          topicId: assumedTopic,
          title: `${file.name} - Page ${p}`,
          content: cleaned,
          source: file.name,
          createdAt: new Date().toISOString(),
        });
      }

      const updated = { sections: [...sections, ...data.sections] };
      notesStorage.save(updated);
      setData(updated);
      setTab('topics');
    } catch (err) {
      console.error(err);
      alert('Failed to import and OCR this PDF.');
    } finally {
      setIsImporting(false);
      setImportProgress('');
    }
  };

  return (
    <div className="aviation-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded text-sm ${tab === 'topics' ? 'bg-aviation-light text-aviation-primary' : 'hover:bg-gray-100'}`}
            onClick={() => setTab('topics')}
          >
            Topics
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${tab === 'import' ? 'bg-aviation-light text-aviation-primary' : 'hover:bg-gray-100'}`}
            onClick={() => setTab('import')}
          >
            Import from PDF (OCR)
          </button>
        </div>

        {tab === 'topics' && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as NoteTopicId | 'all')}
            className="aviation-input text-sm"
          >
            <option value="all">All Topics</option>
            {TOPICS.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        )}
      </div>

      {tab === 'import' && (
        <div className="space-y-3">
          <div className="text-sm text-gray-700">
            Select a PDF scan to extract text via OCR. OCR quality depends on scan clarity.
          </div>
          <ImportForm onImport={handleImportPdf} isImporting={isImporting} progress={importProgress} />
        </div>
      )}

      {tab === 'topics' && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-sm text-gray-600">No notes yet. Use the Import tab to extract notes from PDFs.</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filtered.map(sec => (
                <article key={sec.id} className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800 text-sm truncate">{sec.title}</h4>
                    <span className="text-xs text-gray-500 ml-3">{new Date(sec.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-[13px] whitespace-pre-wrap text-gray-800">
                    {sec.content}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ImportForm: React.FC<{ onImport: (file: File, topic: NoteTopicId) => void; isImporting: boolean; progress: string }>
  = ({ onImport, isImporting, progress }) => {
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState<NoteTopicId>('other');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <select className="aviation-input text-sm" value={topic} onChange={(e) => setTopic(e.target.value as NoteTopicId)}>
          {TOPICS.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <button
          className={`aviation-button text-sm ${!file || isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => file && onImport(file, topic)}
          disabled={!file || isImporting}
        >
          {isImporting ? 'Importing…' : 'Import'}
        </button>
      </div>
      {progress && <div className="text-xs text-gray-600">{progress}</div>}
    </div>
  );
};

export default NotesHub;


