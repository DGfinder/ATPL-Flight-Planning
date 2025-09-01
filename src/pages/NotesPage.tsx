import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { atplCurriculum, getSubjectById, getSubjectsByCategory } from '../data/atplCurriculum';
import { VideoPlaylist } from '../components/video';
import { DocumentLibrary } from '../components/documents';
import SubjectQuestions from '../components/questions/SubjectQuestions';
import TASPracticeTable from '../components/practice/TASPracticeTable';
import type { AtplSubject, AtplSubjectCategory, AtplContentType } from '../types';

const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { subjectId, contentType } = useParams<{ subjectId?: string; contentType?: string }>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory] = useState<AtplSubjectCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<AtplContentType>((contentType as AtplContentType) || 'notes');

  // Get current subject if selected
  const currentSubject = subjectId ? getSubjectById(subjectId) : null;

  // Filter subjects based on search and category
  const filteredSubjects = useMemo(() => {
    let subjects = atplCurriculum.subjects;
    
    if (selectedCategory !== 'all') {
      subjects = getSubjectsByCategory(selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      subjects = subjects.filter(subject => 
        subject.title.toLowerCase().includes(term) ||
        subject.description.toLowerCase().includes(term) ||
        subject.code?.toLowerCase().includes(term)
      );
    }
    
    return subjects.sort((a, b) => a.order - b.order);
  }, [searchTerm, selectedCategory]);

  const handleSubjectSelect = (subject: AtplSubject) => {
    navigate(`/notes/${subject.id}/${activeTab}`);
  };

  const handleTabChange = (tab: AtplContentType) => {
    setActiveTab(tab);
    if (currentSubject) {
      navigate(`/notes/${currentSubject.id}/${tab}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentSubject ? (
        // Topic Detail View
        <div>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-aviation-primary to-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate('/notes')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                >
                  <span>←</span>
                  <span>Back to Topics</span>
                </button>
                
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 text-sm bg-white/20 rounded-full">
                    {currentSubject.code}
                  </span>
                  <span className="px-3 py-1 text-sm bg-white/20 rounded-full">
                    {currentSubject.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="mt-8">
                <h1 className="text-3xl font-bold mb-4">{currentSubject.title}</h1>
                <p className="text-blue-100 text-lg mb-6 max-w-3xl">{currentSubject.description}</p>
                
                <div className="flex items-center space-x-8 text-sm">
                  <span className="flex items-center space-x-2">
                    <span>📄</span>
                    <span>{currentSubject.documents.length} Documents</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span>🎥</span>
                    <span>{currentSubject.videos.length} Videos</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span>⏱️</span>
                    <span>{currentSubject.estimatedStudyHours} Hours</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex space-x-8">
                {(['notes', 'videos', 'practice', 'questions'] as AtplContentType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab
                        ? 'border-aviation-primary text-aviation-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'notes' && '📄 Theory'}
                    {tab === 'videos' && '🎥 Videos'}
                    {tab === 'practice' && '✏️ Practice'}
                    {tab === 'questions' && '❓ Questions'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Panel */}
          <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'notes' && (
                <div className="p-6">
                  <DocumentLibrary
                    documents={currentSubject.documents}
                    title="Theory & Documentation"
                    onDocumentOpen={(documentId) => {
                      console.log('Document opened:', documentId);
                    }}
                  />
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="p-6">
                  <VideoPlaylist
                    videos={currentSubject.videos}
                    title="Video Lessons"
                    autoplayNext={false}
                  />
                </div>
              )}

              {activeTab === 'practice' && (
                <div className="p-6">
                  {currentSubject.id === 'tas_heading_ground_speed' ? (
                    <div className="bg-white rounded-xl p-8 space-y-6">
                      <div className="text-center border-b border-gray-200 pb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          TAS Practice Calculations
                        </h3>
                        <p className="text-gray-600">
                          Practice your flight computer skills with these wind triangle calculations
                        </p>
                      </div>
                      <TASPracticeTable />
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-12 text-center">
                      <div className="text-gray-400 text-6xl mb-4">✏️</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Content Coming Soon</h3>
                      <p className="text-gray-600">
                        Practice exercises for {currentSubject.title} will be added soon.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="p-6">
                  <div className="bg-white rounded-xl">
                    <SubjectQuestions
                      subject={currentSubject}
                      onComplete={(results) => {
                        console.log('Questions completed:', results);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Topic Grid Landing Page
        <div>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Flight Planning & Performance</h1>
                <p className="text-xl text-gray-600 mb-8">Boeing 727 Flight Planning Course</p>
                <div className="flex justify-center space-x-8 text-sm text-gray-500">
                  <span>📄 {atplCurriculum.subjects.filter(s => s.documents.length > 0).length} Topics with Theory</span>
                  <span>🎥 {atplCurriculum.subjects.filter(s => s.videos.length > 0).length} Video Tutorials</span>
                  <span>⏱️ {atplCurriculum.subjects.reduce((sum, s) => sum + s.estimatedStudyHours, 0)} Study Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="relative max-w-lg mx-auto">
                <input
                  type="text"
                  placeholder="Search flight planning topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-aviation-primary focus:border-transparent text-sm shadow-sm"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  🔍
                </div>
              </div>
            </div>
          </div>

          {/* Topic Cards Grid */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No topics found</h3>
                <p className="text-gray-600">Try adjusting your search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSubjects.map((subject) => (
                  <TopicCard
                    key={subject.id}
                    subject={subject}
                    onClick={() => handleSubjectSelect(subject)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TopicCard: React.FC<{
  subject: AtplSubject;
  onClick: () => void;
}> = ({ subject, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hasContent = subject.documents.length > 0 || subject.videos.length > 0;
  const hasTheory = subject.documents.some(doc => doc.description && doc.description.length > 200);
  const hasVideos = subject.videos.length > 0;
  const hasPractice = subject.id === 'tas_heading_ground_speed';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 hover:border-aviation-primary hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden transform hover:-translate-y-1"
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
            📊
          </div>
          <div className="flex space-x-1">
            {hasTheory && <div className="w-3 h-3 bg-blue-500 rounded-full" title="Theory Available"></div>}
            {hasVideos && <div className="w-3 h-3 bg-red-500 rounded-full" title="Videos Available"></div>}
            {hasPractice && <div className="w-3 h-3 bg-green-500 rounded-full" title="Practice Available"></div>}
          </div>
        </div>
        
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-3 line-clamp-3 group-hover:text-aviation-primary transition-colors min-h-[4rem]">
          {subject.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 min-h-[3.5rem]">
          {subject.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {subject.code}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(subject.difficulty)}`}>
            {subject.difficulty}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
          <div className="flex space-x-4">
            <span className="flex items-center space-x-1">
              <span>📄</span>
              <span>{subject.documents.length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>🎥</span>
              <span>{subject.videos.length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>✏️</span>
              <span>{hasPractice ? '1' : '0'}</span>
            </span>
          </div>
          <span className="font-bold text-aviation-primary">
            {subject.estimatedStudyHours}h
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-aviation-primary to-blue-500 h-2 rounded-full transition-all duration-500 group-hover:from-blue-500 group-hover:to-aviation-primary"
            style={{ width: `${hasContent ? Math.min(25 + (hasVideos ? 25 : 0) + (hasPractice ? 25 : 0), 75) : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesPage;