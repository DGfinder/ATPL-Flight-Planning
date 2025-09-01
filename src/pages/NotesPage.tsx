import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { atplCurriculum, getSubjectById, getSubjectsByCategory, getAllCategories, getCategoryInfo } from '../data/atplCurriculum';
import { VideoPlaylist } from '../components/video';
import { DocumentLibrary } from '../components/documents';
import SubjectQuestions from '../components/questions/SubjectQuestions';
import TASPracticeTable from '../components/practice/TASPracticeTable';
import type { AtplSubject, AtplSubjectCategory, AtplContentType } from '../types';

const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const { subjectId, contentType } = useParams<{ subjectId?: string; contentType?: string }>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AtplSubjectCategory | 'all'>('all');
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
    <div className="flex h-full bg-gray-50">
      {/* Subject Navigation Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ATPL Course Notes</h1>
          <p className="text-sm text-gray-600">Professional pilot training curriculum</p>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as AtplSubjectCategory | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {getAllCategories().map(category => {
              const categoryInfo = getCategoryInfo(category);
              return (
                <option key={category} value={category}>
                  {categoryInfo.icon} {categoryInfo.title}
                </option>
              );
            })}
          </select>
        </div>

        {/* Subject List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSubjects.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No subjects found matching your criteria
            </div>
          ) : (
            <div className="p-2">
              {filteredSubjects.map((subject) => {
                const categoryInfo = getCategoryInfo(subject.category);
                const isActive = currentSubject?.id === subject.id;
                
                return (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectSelect(subject)}
                    className={`w-full text-left p-3 mb-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-900'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`text-lg ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                        {categoryInfo.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-medium text-sm truncate ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                            {subject.title}
                          </h3>
                          {subject.code && (
                            <span className={`px-2 py-1 text-xs rounded ${
                              isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {subject.code}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-1 line-clamp-2 ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                          {subject.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                            📄 {subject.documents.length} docs
                          </span>
                          <span className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                            🎥 {subject.videos.length} videos
                          </span>
                          <span className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                            ⏱️ {subject.estimatedStudyHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentSubject ? (
          <>
            {/* Subject Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {getCategoryInfo(currentSubject.category).icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-bold text-gray-900">{currentSubject.title}</h1>
                    {currentSubject.code && (
                      <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {currentSubject.code}
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      currentSubject.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      currentSubject.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentSubject.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{currentSubject.description}</p>
                  <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                    <span>📄 {currentSubject.documents.length} Documents</span>
                    <span>🎥 {currentSubject.videos.length} Videos</span>
                    <span>⏱️ {currentSubject.estimatedStudyHours} Hours</span>
                    <span>❓ {currentSubject.questionCategories.length} Question Categories</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white border-b border-gray-200 px-6">
              <div className="flex space-x-8">
                {(['notes', 'videos', 'practice', 'questions'] as AtplContentType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'notes' && '📄 Notes & Documents'}
                    {tab === 'videos' && '🎥 Video Lessons'}
                    {tab === 'practice' && '✏️ Practice'}
                    {tab === 'questions' && '❓ Questions'}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Panel */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'notes' && (
                <div className="p-6">
                  <DocumentLibrary
                    documents={currentSubject.documents}
                    title={`${currentSubject.title} - Course Documents`}
                    onDocumentOpen={(documentId) => {
                      console.log('Document opened:', documentId);
                      // Here you could update user progress, etc.
                    }}
                  />
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="p-6">
                  <VideoPlaylist
                    videos={currentSubject.videos}
                    title={`${currentSubject.title} - Video Lessons`}
                    autoplayNext={false}
                  />
                </div>
              )}

              {activeTab === 'practice' && (
                <div className="p-6">
                  {currentSubject.id === 'tas_heading_ground_speed' ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          TAS Practice Calculations
                        </h3>
                        <p className="text-gray-600">
                          Practice your flight computer skills with these wind triangle calculations
                        </p>
                      </div>
                      <TASPracticeTable />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">✏️</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Practice Content Coming Soon</h3>
                      <p className="text-gray-600">
                        Practice exercises for {currentSubject.title} will be added soon.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="p-6">
                  <SubjectQuestions
                    subject={currentSubject}
                    onComplete={(results) => {
                      console.log('Questions completed:', results);
                      // Here you could update user progress, show completion notifications, etc.
                    }}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          // Welcome/Selection State
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-6">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ATPL Course Notes</h2>
              <p className="text-gray-600 mb-6">
                Select a subject from the sidebar to access comprehensive study materials including 
                PDF documents, video lessons, and practice questions.
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Available Content</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📄 {atplCurriculum.subjects.reduce((sum, s) => sum + s.documents.length, 0)} Documents</div>
                  <div>🎥 {atplCurriculum.subjects.reduce((sum, s) => sum + s.videos.length, 0)} Video Lessons</div>
                  <div>⏱️ {atplCurriculum.subjects.reduce((sum, s) => sum + s.estimatedStudyHours, 0)} Study Hours</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;