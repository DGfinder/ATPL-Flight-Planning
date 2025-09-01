import React, { useMemo, useState, useEffect } from 'react';
import { notesStorage } from '../../utils/notesStorage';
import { topicStorage } from '../../utils/topicStorage';
import type { NoteSection, NoteTopicId, TopicContent } from '../../types';
import { GlobalWorkerOptions, getDocument, version } from 'pdfjs-dist';
import { extractTextFromImage, renderPdfPageToImageDataUrl } from '../../utils/ocr';
import { initialTopics } from '../../data/initialTopics';
import TASPracticeTable from '../practice/TASPracticeTable';

// Configure worker (CDN fallback)
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

const TOPICS: { id: NoteTopicId; label: string }[] = [
  { id: 'tas_heading_ground_speed', label: 'TAS, Heading and Ground Speed determinations using the flight computer' },
  { id: 'speed_sound_mach_tat', label: 'The Speed of Sound and Mach Numbers, Total Air Temperature' },
  { id: 'route_sector_winds_temp', label: 'Route Sector Winds and Temperature (RSWT)' },
  { id: 'magnetic_variation', label: 'Magnetic Variation' },
  { id: 'ins_data', label: 'INS Data' },
  { id: 'climb_tables', label: 'Climb Tables' },
  { id: 'descent_tables', label: 'Descent Tables' },
  { id: 'altitude_capability', label: 'Altitude Capability' },
  { id: 'cruise_data', label: 'Cruise Data' },
  { id: 'buffet_boundary_charts', label: 'Buffet Boundary Charts' },
  { id: 'flight_planning_basics', label: 'Flight Planning Basics' },
  { id: 'real_flight_plans', label: 'Real Flight Plans' },
  { id: 'step_climbs', label: 'Step Climbs' },
  { id: 'backwards_flight_plans', label: 'Backwards Flight Plans' },
  { id: 'max_payload_min_fuel_abnormal', label: 'Maximum Payload and Minimum Fuel Flight Plans 126 Abnormal Operations' },
  { id: 'depressurised_flight', label: 'Depressurised Flight' },
  { id: 'yaw_damper_inoperative', label: 'Yaw Damper Inoperative Flight' },
  { id: 'tailskid_extended', label: 'Operation with the Tailskid extended' },
  { id: 'landing_gear_extended', label: 'Landing Gear extended flight' },
  { id: 'one_engine_inoperative', label: 'One Engine In-Operative Flight' },
  { id: 'fuel_dumping', label: 'Fuel Dumping' },
  { id: 'holding_fuel', label: 'Holding Fuel' },
  { id: 'company_fuel_policy', label: 'The Company Fuel Policy' },
  { id: 'minimum_fuel_requirements', label: 'Minimum Fuel Requirements' },
  { id: 'minimum_aerodrome_standards', label: 'Minimum Aerodrome Standards' },
  { id: 'inflight_replanning', label: 'In-Flight Re-Planning' },
  { id: 'boeing_727_weight_limits', label: 'Boeing 727 maximum weight limitations' },
  { id: 'destination_alternate_fuel', label: 'Destination -Alternate Fuel Policy' },
  { id: 'equi_time_point', label: 'Equi-Time Point (Critical Point)' },
  { id: 'point_no_return', label: 'Point of No Return (PNR)' },
];

type Tab = 'topics' | 'import';
type TopicTab = 'theory' | 'videos' | 'practice' | 'imported';

const NotesHub: React.FC = () => {
  const [tab, setTab] = useState<Tab>('topics');
  const [data, setData] = useState(notesStorage.load());
  const [selectedTopic, setSelectedTopic] = useState<NoteTopicId | null>(null);
  const [topicTab, setTopicTab] = useState<TopicTab>('theory');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<string>('');
  
  const topicContent = selectedTopic ? topicStorage.getTopicContent(selectedTopic) : null;

  useEffect(() => {
    const existingData = topicStorage.load();
    if (existingData.topics.length === 0) {
      initialTopics.forEach(topic => topicStorage.saveTopicContent(topic));
    }
  }, []);

  const groupedSections = useMemo(() => {
    const groups: Record<string, NoteSection[]> = {};
    data.sections.forEach(section => {
      if (!groups[section.topicId]) groups[section.topicId] = [];
      groups[section.topicId].push(section);
    });
    return groups;
  }, [data.sections]);

  const handleImportPdf = async (file: File, assumedTopic: NoteTopicId = 'tas_heading_ground_speed') => {
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

        {tab === 'topics' && selectedTopic && (
          <button
            onClick={() => setSelectedTopic(null)}
            className="aviation-button-secondary text-sm"
          >
            ← Back to Topics
          </button>
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

      {tab === 'topics' && !selectedTopic && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOPICS.map(topic => {
            const hasContent = topicStorage.getTopicContent(topic.id);
            const hasImportedNotes = groupedSections[topic.id]?.length > 0;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <div className="font-medium text-sm text-gray-800 mb-1">{topic.label}</div>
                <div className="text-xs text-gray-500">
                  {hasContent ? '✓ Theory content' : 'No theory content'}
                  {hasImportedNotes && <span className="block">📄 {groupedSections[topic.id].length} imported notes</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {tab === 'topics' && selectedTopic && (
        <TopicDetailView 
          topicId={selectedTopic} 
          topicTab={topicTab} 
          setTopicTab={setTopicTab}
          importedSections={groupedSections[selectedTopic] || []}
        />
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

const TopicDetailView: React.FC<{
  topicId: NoteTopicId;
  topicTab: TopicTab;
  setTopicTab: (tab: TopicTab) => void;
  importedSections: NoteSection[];
}> = ({ topicId, topicTab, setTopicTab, importedSections }) => {
  const topicContent = topicStorage.getTopicContent(topicId);
  const topicInfo = TOPICS.find(t => t.id === topicId)!;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">{topicInfo.label}</h3>
      
      <div className="flex space-x-2 border-b">
        <button
          className={`px-3 py-2 text-sm ${topicTab === 'theory' ? 'border-b-2 border-aviation-primary text-aviation-primary' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setTopicTab('theory')}
        >
          Theory
        </button>
        <button
          className={`px-3 py-2 text-sm ${topicTab === 'videos' ? 'border-b-2 border-aviation-primary text-aviation-primary' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setTopicTab('videos')}
        >
          Videos
        </button>
        <button
          className={`px-3 py-2 text-sm ${topicTab === 'practice' ? 'border-b-2 border-aviation-primary text-aviation-primary' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => setTopicTab('practice')}
        >
          Practice
        </button>
        {importedSections.length > 0 && (
          <button
            className={`px-3 py-2 text-sm ${topicTab === 'imported' ? 'border-b-2 border-aviation-primary text-aviation-primary' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setTopicTab('imported' as TopicTab)}
          >
            Imported ({importedSections.length})
          </button>
        )}
      </div>

      <div className="mt-4">
        {topicTab === 'theory' && (
          <div className="space-y-4">
            {topicContent?.theory ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {topicContent.theory}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 italic">
                No theory content available for this topic yet.
              </div>
            )}
          </div>
        )}

        {topicTab === 'videos' && (
          <div className="space-y-3">
            {topicContent?.videos.length ? (
              topicContent.videos.map(video => (
                <div key={video.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">{video.title}</h4>
                  {video.description && (
                    <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                  )}
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      className="w-full h-full rounded"
                      allowFullScreen
                      title={video.title}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-600 italic">
                No videos available for this topic yet.
              </div>
            )}
          </div>
        )}

        {topicTab === 'practice' && (
          <div className="space-y-3">
            {topicContent?.practice.length ? (
              topicContent.practice.map(item => (
                <div key={item.id} className="border rounded-lg">
                  <div className="flex items-center justify-between mb-2 p-3 border-b">
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{item.type}</span>
                  </div>
                  <div className="p-3">
                    {item.content === 'INTERACTIVE_TABLE:TAS' ? (
                      <TASPracticeTable />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm text-gray-700">
                        {item.content}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-600 italic">
                No practice content available for this topic yet.
              </div>
            )}
          </div>
        )}

        {topicTab === 'imported' && importedSections.length > 0 && (
          <div className="space-y-3">
            {importedSections.map(sec => (
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
    </div>
  );
};

export default NotesHub;


