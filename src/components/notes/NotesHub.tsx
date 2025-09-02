import React, { useMemo, useState, useEffect } from 'react';
import { notesStorage } from '../../utils/notesStorage';
import { topicStorage } from '../../utils/topicStorage';
import type { NoteSection, NoteTopicId } from '../../types';
import { initialTopics } from '../../data/initialTopics';
import TASPracticeTable from '../practice/TASPracticeTable';
import { InteractiveCard, CardHeader, CardContent, Card, Button, useDesignSystem } from '../../design-system';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  initialContent: string;
  topicTitle: string;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, initialContent, topicTitle }) => {
  const { colors, spacing, styles } = useDesignSystem();
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <Card style={{
        padding: spacing.scale[4],
        maxWidth: '90vw',
        maxHeight: '90vh',
        width: '800px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.scale[3] }}>
          <h3 style={{ 
            ...styles.heading, 
            fontSize: '1.25rem',
            fontWeight: 600,
            color: colors.aviation.primary
          }}>
            Edit Theory Content: {topicTitle}
          </h3>
          <Button
            onClick={onClose}
            style={{ 
              background: colors.gray[200], 
              color: colors.gray[700],
              border: 'none',
              padding: '8px 12px',
              borderRadius: spacing.radius.sm,
              cursor: 'pointer'
            }}
          >
            ✕
          </Button>
        </div>
        
        <div style={{ flex: 1, marginBottom: spacing.scale[3] }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              height: '400px',
              padding: spacing.scale[3],
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: spacing.radius.md,
              fontSize: '0.875rem',
              lineHeight: '1.6',
              fontFamily: 'monospace',
              resize: 'vertical'
            }}
            placeholder="Enter theory content here..."
          />
        </div>
        
        <div style={{ display: 'flex', gap: spacing.scale[2], justifyContent: 'flex-end' }}>
          <Button
            onClick={onClose}
            style={{ 
              background: colors.gray[200], 
              color: colors.gray[700],
              border: 'none',
              padding: '10px 20px',
              borderRadius: spacing.radius.md,
              cursor: 'pointer'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{ 
              background: colors.aviation.primary, 
              color: colors.white,
              border: 'none',
              padding: '10px 20px',
              borderRadius: spacing.radius.md,
              cursor: 'pointer'
            }}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

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
  { id: 'point_of_no_return', label: 'Point of No Return' },
  { id: 'fuel_planning_basics', label: 'Fuel Planning Basics' },
  { id: 'weight_balance_basics', label: 'Weight and Balance Basics' },
  { id: 'performance_basics', label: 'Performance Basics' },
  { id: 'meteorology_basics', label: 'Meteorology Basics' },
  { id: 'navigation_basics', label: 'Navigation Basics' },
  { id: 'flight_planning_procedures', label: 'Flight Planning Procedures' },
];

type TopicTab = 'theory' | 'videos' | 'practice' | 'imported';

const NotesHub: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const data = notesStorage.load();
  const [selectedTopic, setSelectedTopic] = useState<NoteTopicId | null>(null);
  const [topicTab, setTopicTab] = useState<TopicTab>('theory');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTopicContent, setCurrentTopicContent] = useState('');
  
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

  const topicContent = useMemo(() => {
    if (!selectedTopic) return null;
    const existingData = topicStorage.load();
    return existingData.topics.find(topic => topic.topicId === selectedTopic);
  }, [selectedTopic]);

  const handleEditTheory = () => {
    if (topicContent) {
      setCurrentTopicContent(topicContent.theory);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveTheory = (newContent: string) => {
    if (selectedTopic && topicContent) {
      const updatedTopic = {
        ...topicContent,
        theory: newContent,
        lastUpdated: new Date().toISOString()
      };
      topicStorage.saveTopicContent(updatedTopic);
      // Force re-render
      setSelectedTopic(null);
      setTimeout(() => setSelectedTopic(selectedTopic), 100);
    }
  };

  return (
    <div>
      {!selectedTopic && (
        <div 
          style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: spacing.scale[4]
          }}
        >
          {TOPICS.map((topic) => (
            <InteractiveCard
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              style={{ cursor: 'pointer' }}
            >
              <CardHeader>
                <h3 style={{ ...styles.heading, fontSize: '1rem', margin: 0 }}>
                  {topic.label}
                </h3>
              </CardHeader>
            </InteractiveCard>
          ))}
        </div>
      )}

      {selectedTopic && topicContent && (
        <div>
          {/* Header with back button and edit button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: spacing.scale[4]
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
              <Button
                onClick={() => setSelectedTopic(null)}
                style={{ 
                  background: colors.gray[200], 
                  color: colors.gray[700],
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: spacing.radius.sm,
                  cursor: 'pointer'
                }}
              >
                ← Back to Topics
              </Button>
              <h2 style={{ ...styles.heading, fontSize: '1.5rem', margin: 0 }}>
                {TOPICS.find(t => t.id === selectedTopic)?.label}
              </h2>
            </div>
            
            {/* Admin Edit Button - Only show for TAS topic */}
            {selectedTopic === 'tas_heading_ground_speed' && (
              <Button
                onClick={handleEditTheory}
                style={{ 
                  background: colors.aviation.secondary, 
                  color: colors.white,
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: spacing.radius.sm,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                ✏️ Edit Content
              </Button>
            )}
          </div>

          {/* Tab Navigation */}
          <div style={{ 
            display: 'flex', 
            gap: spacing.scale[1], 
            marginBottom: spacing.scale[4],
            borderBottom: `1px solid ${colors.gray[200]}`
          }}>
            {(['theory', 'videos', 'practice', 'imported'] as TopicTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setTopicTab(tab)}
                style={{
                  padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                  border: 'none',
                  background: topicTab === tab ? colors.aviation.primary : colors.gray[100],
                  color: topicTab === tab ? colors.white : colors.gray[700],
                  borderRadius: `${spacing.radius.md} ${spacing.radius.md} 0 0`,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: topicTab === tab ? 600 : 400
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div>
            {topicTab === 'theory' && (
              <Card style={{ padding: spacing.scale[6] }}>
                <div style={{
                  color: colors.aviation.navy,
                  lineHeight: '1.7',
                  fontSize: '0.875rem'
                }}>
                  {/* Parse and structure the theory content */}
                  {topicContent.theory.split('\n').map((paragraph, index) => {
                    const trimmedParagraph = paragraph.trim();
                    if (!trimmedParagraph) return null;

                    // Detect different content types
                    if (trimmedParagraph.startsWith('Example Calculation:')) {
                      return (
                        <div key={index} style={{ marginTop: spacing.scale[4] }}>
                          <h4 style={{
                            ...styles.heading,
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: colors.aviation.primary,
                            marginBottom: spacing.scale[3]
                          }}>
                            Example Calculation:
                          </h4>
                        </div>
                      );
                    }

                    if (trimmedParagraph.startsWith('Given:') || trimmedParagraph.startsWith('Prompt:') || trimmedParagraph.startsWith('Step')) {
                      return (
                        <div key={index} style={{ marginTop: spacing.scale[3] }}>
                          <h5 style={{
                            ...styles.heading,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: colors.aviation.secondary,
                            marginBottom: spacing.scale[2]
                          }}>
                            {trimmedParagraph}
                          </h5>
                        </div>
                      );
                    }

                    if (trimmedParagraph.match(/^[A-Z][A-Z\s]+$/)) {
                      // All caps line - likely a heading
                      return (
                        <div key={index} style={{ marginTop: spacing.scale[4] }}>
                          <h4 style={{
                            ...styles.heading,
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: colors.aviation.primary,
                            marginBottom: spacing.scale[2]
                          }}>
                            {trimmedParagraph}
                          </h4>
                        </div>
                      );
                    }

                    // Regular paragraph
                    return (
                      <p key={index} style={{
                        marginBottom: spacing.scale[3],
                        color: colors.aviation.navy,
                        lineHeight: '1.7',
                        fontSize: '0.875rem'
                      }}>
                        {trimmedParagraph}
                      </p>
                    );
                  })}
                </div>
              </Card>
            )}

            {topicTab === 'videos' && (
              <div>
                {topicContent.videos?.map((video) => (
                  <Card key={video.id} style={{ marginBottom: spacing.scale[4] }}>
                    <CardHeader>
                      <h4 style={{ ...styles.heading, fontSize: '1.125rem', margin: 0 }}>
                        {video.title}
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <p style={{ color: colors.aviation.muted, marginBottom: spacing.scale[3] }}>
                        {video.description}
                      </p>
                      <div style={{
                        position: 'relative',
                        paddingBottom: '56.25%',
                        height: 0,
                        overflow: 'hidden'
                      }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none'
                          }}
                          allowFullScreen
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {topicTab === 'practice' && (
              <div>
                {topicContent.practice?.map((item) => (
                  <Card key={item.id} style={{ marginBottom: spacing.scale[4] }}>
                    <CardHeader>
                      <h4 style={{ ...styles.heading, fontSize: '1.125rem', margin: 0 }}>
                        {item.title}
                      </h4>
                    </CardHeader>
                    <CardContent>
                      {item.content === 'INTERACTIVE_TABLE:TAS' && <TASPracticeTable />}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {topicTab === 'imported' && (
              <div>
                {groupedSections[selectedTopic]?.map((section) => (
                  <Card key={section.id} style={{ marginBottom: spacing.scale[4] }}>
                    <CardHeader>
                      <h4 style={{ ...styles.heading, fontSize: '1.125rem', margin: 0 }}>
                        {section.title}
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <p style={{ color: colors.aviation.muted }}>
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTheory}
        initialContent={currentTopicContent}
        topicTitle={TOPICS.find(t => t.id === selectedTopic)?.label || ''}
      />
    </div>
  );
};

export default NotesHub;


