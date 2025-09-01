import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { atplCurriculum, getSubjectById, getSubjectsByCategory } from '../data/atplCurriculum';
import { VideoPlaylist } from '../components/video';
import { DocumentLibrary } from '../components/documents';
import SubjectQuestions from '../components/questions/SubjectQuestions';
import TASPracticeTable from '../components/practice/TASPracticeTable';
import { Card } from '../design-system';
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
    <div className="min-h-screen bg-aviation-light">
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
                    <span className="text-blue-200">DOC</span>
                    <span>{currentSubject.documents.length} Documents</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span className="text-blue-200">VID</span>
                    <span>{currentSubject.videos.length} Videos</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span className="text-blue-200">HRS</span>
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
                    {tab === 'notes' && 'Theory'}
                    {tab === 'videos' && 'Videos'}
                    {tab === 'practice' && 'Practice'}
                    {tab === 'questions' && 'Questions'}
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
                      <div className="text-gray-400 text-2xl font-bold mb-4">PRACTICE</div>
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
                  <span>{atplCurriculum.subjects.filter(s => s.documents.length > 0).length} Topics with Theory</span>
                  <span>{atplCurriculum.subjects.filter(s => s.videos.length > 0).length} Video Tutorials</span>
                  <span>{atplCurriculum.subjects.reduce((sum, s) => sum + s.estimatedStudyHours, 0)} Study Hours</span>
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
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                  SEARCH
                </div>
              </div>
            </div>
          </div>

          {/* Topic Cards Grid */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-2xl font-bold mb-4">NO RESULTS</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No topics found</h3>
                <p className="text-gray-600">Try adjusting your search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
  const getTopicIcon = (subjectId: string) => {
    const iconMap: Record<string, string> = {
      'tas_heading_ground_speed': 'NAV',
      'speed_sound_mach_tat': 'SPD',
      'route_sector_winds_temp': 'WX',
      'magnetic_variation': 'MAG',
      'ins_data': 'INS',
      'climb_tables': 'CLB',
      'descent_tables': 'DES',
      'altitude_capability': 'ALT',
      'cruise_data': 'CRZ',
      'buffet_boundary_charts': 'BUF',
      'flight_planning_basics': 'FPL',
      'real_flight_plans': 'PLN',
      'step_climbs': 'STP',
      'backwards_flight_plans': 'REV',
      'max_payload_min_fuel_abnormal': 'WGT',
      'depressurised_flight': 'DPR',
      'yaw_damper_inoperative': 'YAW',
      'tailskid_extended': 'TSK',
      'landing_gear_extended': 'LDG',
      'one_engine_inoperative': 'ENG',
      'fuel_dumping': 'DMP',
      'holding_fuel': 'HLD',
      'company_fuel_policy': 'POL',
      'minimum_fuel_requirements': 'MIN',
      'minimum_aerodrome_standards': 'STD',
      'inflight_replanning': 'RPL',
      'boeing_727_weight_limits': 'LIM',
      'destination_alternate_fuel': 'ALT',
      'equi_time_point': 'ETP',
      'point_no_return': 'PNR'
    };
    return iconMap[subjectId] || 'THY';
  };

  return (
    <Card
      onClick={onClick}
      variant="interactive"
      padding="none"
      className="cursor-pointer group p-8 text-center transform hover:-translate-y-1 transition-all duration-300 min-h-[280px] flex flex-col justify-between"
    >
      {/* Large Icon */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-aviation-primary text-white rounded-xl flex items-center justify-center text-lg font-bold tracking-wider mb-6 group-hover:scale-110 transition-transform duration-300">
          {getTopicIcon(subject.id)}
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-aviation-navy text-lg leading-tight mb-4 group-hover:text-aviation-primary transition-colors">
          {subject.title}
        </h3>
        
        {/* Description */}
        <p className="text-aviation-muted text-sm leading-relaxed line-clamp-3">
          {subject.description}
        </p>
      </div>

      {/* Action Button */}
      <div className="flex justify-end mt-6">
        <div className="bg-aviation-primary hover:bg-aviation-navy text-white rounded-full p-3 transition-colors duration-300 group-hover:scale-110">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default NotesPage;