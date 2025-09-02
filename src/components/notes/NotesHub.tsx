import React, { useMemo, useState, useEffect } from 'react';
import { notesStorage } from '../../utils/notesStorage';
import { topicStorage } from '../../utils/topicStorage';
import type { NoteSection, NoteTopicId } from '../../types';
import { initialTopics } from '../../data/initialTopics';
import TASPracticeTable from '../practice/TASPracticeTable';
import { InteractiveCard, CardHeader, CardContent, Card, Button, useDesignSystem } from '../../design-system';


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

type TopicTab = 'theory' | 'videos' | 'practice' | 'imported';

const NotesHub: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const data = notesStorage.load();
  const [selectedTopic, setSelectedTopic] = useState<NoteTopicId | null>(null);
  const [topicTab, setTopicTab] = useState<TopicTab>('theory');
  
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
          {TOPICS.map(topic => {
            const hasContent = topicStorage.getTopicContent(topic.id);
            const hasImportedNotes = groupedSections[topic.id]?.length > 0;
            const topicContent = hasContent ? topicStorage.getTopicContent(topic.id) : null;
            
            // Calculate progress indicators
            const hasTheory = topicContent?.theory && topicContent.theory.length > 0;
            const hasVideos = topicContent?.videos && topicContent.videos.length > 0;
            const hasPractice = topicContent?.practice && topicContent.practice.length > 0;
            
            const completedSections = [hasTheory, hasVideos, hasPractice].filter(Boolean).length;
            const totalSections = 3;
            const progressPercentage = Math.round((completedSections / totalSections) * 100);
            
            return (
              <InteractiveCard
                key={topic.id}
                padding="none"
                onClick={() => setSelectedTopic(topic.id)}
                style={{
                  minHeight: '140px',
                  transition: 'all 0.2s ease-in-out',
                  border: `1px solid ${colors.gray[200]}`,
                  cursor: 'pointer'
                }}
              >
                <CardHeader
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.gray[100]}`
                  }}
                >
                  <div>
                    <h3 style={{
                      ...styles.heading,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      margin: 0,
                      marginBottom: spacing.scale[1],
                      lineHeight: '1.3'
                    }}>
                      {topic.label}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[1] }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: colors.aviation.muted,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.scale[2]
                      }}>
                        {progressPercentage > 0 ? (
                          <>
                            <span style={{ 
                              backgroundColor: colors.aviation.primary,
                              color: colors.white,
                              padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
                              borderRadius: spacing.radius.sm,
                              fontSize: '0.6875rem',
                              fontWeight: 500
                            }}>
                              {progressPercentage}% Complete
                            </span>
                          </>
                        ) : (
                          <span style={{ color: colors.gray[400] }}>
                            Not started
                          </span>
                        )}
                      </div>
                      
                      {/* Progress bar */}
                      <div style={{
                        width: '100%',
                        height: '3px',
                        backgroundColor: colors.gray[200],
                        borderRadius: spacing.radius.sm,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progressPercentage}%`,
                          height: '100%',
                          backgroundColor: progressPercentage > 0 ? colors.aviation.primary : 'transparent',
                          borderRadius: spacing.radius.sm,
                          transition: 'width 0.3s ease-in-out'
                        }} />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent style={{ padding: spacing.scale[4] }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[2] }}>
                    {/* Content indicators */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.scale[1] }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: spacing.scale[1],
                        fontSize: '0.6875rem',
                        color: hasTheory ? colors.aviation.primary : colors.gray[400]
                      }}>
                        <span>{hasTheory ? '✓' : '○'}</span>
                        <span>Theory</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: spacing.scale[1],
                        fontSize: '0.6875rem',
                        color: hasVideos ? colors.aviation.primary : colors.gray[400]
                      }}>
                        <span>{hasVideos ? '✓' : '○'}</span>
                        <span>Videos</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: spacing.scale[1],
                        fontSize: '0.6875rem',
                        color: hasPractice ? colors.aviation.primary : colors.gray[400]
                      }}>
                        <span>{hasPractice ? '✓' : '○'}</span>
                        <span>Practice</span>
                      </div>
                    </div>
                    
                    {hasImportedNotes && (
                      <div style={{
                        fontSize: '0.6875rem',
                        color: colors.aviation.muted,
                        fontStyle: 'italic'
                      }}>
                        📄 {groupedSections[topic.id].length} imported note{groupedSections[topic.id].length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </CardContent>
              </InteractiveCard>
            );
          })}
        </div>
      )}

      {selectedTopic && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedTopic(null)}
            >
              ← Back to Topics
            </Button>
          </div>
          <TopicDetailView 
            topicId={selectedTopic} 
            topicTab={topicTab} 
            setTopicTab={setTopicTab}
            importedSections={groupedSections[selectedTopic] || []}
          />
        </>
      )}
    </div>
  );
};


const TopicDetailView: React.FC<{
  topicId: NoteTopicId;
  topicTab: TopicTab;
  setTopicTab: (tab: TopicTab) => void;
  importedSections: NoteSection[];
}> = ({ topicId, topicTab, setTopicTab, importedSections }) => {
  const { colors, spacing, styles } = useDesignSystem();
  const topicContent = topicStorage.getTopicContent(topicId);
  const topicInfo = TOPICS.find(t => t.id === topicId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
      <h3 style={{ ...styles.heading, fontSize: '1.125rem', color: colors.aviation.navy }}>{topicInfo.label}</h3>
      
      <div style={{ display: 'flex', gap: spacing.scale[2], borderBottom: `1px solid ${colors.gray[200]}` }}>
        <Button
          variant={topicTab === 'theory' ? 'primary' : 'ghost'}
          size="sm"
          style={{
            borderBottom: topicTab === 'theory' ? `2px solid ${colors.aviation.primary}` : 'none'
          }}
          onClick={() => setTopicTab('theory')}
        >
          Theory
        </Button>
        <Button
          variant={topicTab === 'videos' ? 'primary' : 'ghost'}
          size="sm"
          style={{
            borderBottom: topicTab === 'videos' ? `2px solid ${colors.aviation.primary}` : 'none'
          }}
          onClick={() => setTopicTab('videos')}
        >
          Videos
        </Button>
        <Button
          variant={topicTab === 'practice' ? 'primary' : 'ghost'}
          size="sm"
          style={{
            borderBottom: topicTab === 'practice' ? `2px solid ${colors.aviation.primary}` : 'none'
          }}
          onClick={() => setTopicTab('practice')}
        >
          Practice
        </Button>
        {importedSections.length > 0 && (
          <Button
            variant={topicTab === 'imported' ? 'primary' : 'ghost'}
            size="sm"
            style={{
              borderBottom: topicTab === 'imported' ? `2px solid ${colors.aviation.primary}` : 'none'
            }}
            onClick={() => setTopicTab('imported' as TopicTab)}
          >
            Imported ({importedSections.length})
          </Button>
        )}
      </div>

      <div style={{ marginTop: spacing.scale[4] }}>
        {topicTab === 'theory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[6] }}>
            {topicContent?.theory ? (
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
                    
                    if (trimmedParagraph.startsWith('Given Data:') || trimmedParagraph.startsWith('Prompt:') || trimmedParagraph.startsWith('Step')) {
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
            ) : (
              <Card style={{ padding: spacing.scale[6], textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: colors.aviation.muted, 
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.scale[2]
                }}>
                  <span>📚</span>
                  No theory content available for this topic yet.
                </div>
              </Card>
            )}
          </div>
        )}

        {topicTab === 'videos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
            {topicContent?.videos.length ? (
              topicContent.videos.map(video => (
                <div key={video.id} style={{ 
                  padding: spacing.scale[3], 
                  border: `1px solid ${colors.gray[200]}`, 
                  borderRadius: spacing.radius.lg 
                }}>
                  <h4 style={{ fontWeight: 500, color: colors.aviation.navy, marginBottom: spacing.scale[2] }}>{video.title}</h4>
                                      {video.description && (
                      <p style={{ fontSize: '0.875rem', color: colors.aviation.muted, marginBottom: spacing.scale[3] }}>{video.description}</p>
                    )}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    borderRadius: spacing.radius.lg,
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
                        border: 'none',
                        borderRadius: spacing.radius.lg
                      }}
                      allowFullScreen
                      title={video.title}
                    />
                  </div>
                </div>
              ))
            ) : (
              <Card style={{ padding: spacing.scale[6], textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: colors.aviation.muted, 
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.scale[2]
                }}>
                  <span>🎥</span>
                  No videos available for this topic yet.
                </div>
              </Card>
            )}
          </div>
        )}

        {topicTab === 'practice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
            {topicContent?.practice.length ? (
              topicContent.practice.map(item => (
                <Card key={item.id} style={{ padding: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: spacing.scale[3],
                    borderBottom: `1px solid ${colors.gray[200]}`
                  }}>
                    <h4 style={{
                      ...styles.heading,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: colors.aviation.navy,
                      margin: 0
                    }}>
                      {item.title}
                    </h4>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
                      backgroundColor: colors.gray[100],
                      borderRadius: spacing.radius.sm,
                      color: colors.aviation.muted
                    }}>
                      {item.type}
                    </span>
                  </div>
                  <div style={{ padding: spacing.scale[3] }}>
                    {item.content === 'INTERACTIVE_TABLE:TAS' ? (
                      <TASPracticeTable />
                    ) : (
                      <div style={{
                        whiteSpace: 'pre-wrap',
                        fontSize: '0.875rem',
                        color: colors.aviation.navy,
                        lineHeight: '1.6'
                      }}>
                        {item.content}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card style={{ padding: spacing.scale[6], textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: colors.aviation.muted, 
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.scale[2]
                }}>
                  <span>✏️</span>
                  No practice content available for this topic yet.
                </div>
              </Card>
            )}
          </div>
        )}

        {topicTab === 'imported' && importedSections.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
            {importedSections.map(sec => (
              <Card key={sec.id} style={{ padding: spacing.scale[3] }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: spacing.scale[1]
                }}>
                  <h4 style={{
                    ...styles.heading,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.aviation.navy,
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1
                  }}>
                    {sec.title}
                  </h4>
                  <span style={{
                    fontSize: '0.75rem',
                    color: colors.aviation.muted,
                    marginLeft: spacing.scale[3],
                    whiteSpace: 'nowrap'
                  }}>
                    {new Date(sec.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  whiteSpace: 'pre-wrap',
                  color: colors.aviation.navy,
                  lineHeight: '1.5'
                }}>
                  {sec.content}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesHub;


