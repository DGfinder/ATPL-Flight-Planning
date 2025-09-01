import type { AtplCurriculum, AtplSubject, AtplSubjectCategory } from '../types';

// ATPL Subject Categories with metadata
const atplCategories: Record<AtplSubjectCategory, {
  title: string;
  description: string;
  color: string;
  icon: string;
}> = {
  air_law: {
    title: 'Air Law',
    description: 'Aviation regulations, international law, and legal requirements',
    color: 'bg-blue-500',
    icon: '⚖️'
  },
  aircraft_general: {
    title: 'Aircraft General Knowledge',
    description: 'Aircraft systems, structures, and technical knowledge',
    color: 'bg-green-500',
    icon: '✈️'
  },
  flight_performance: {
    title: 'Flight Performance & Planning',
    description: 'Aircraft performance calculations and flight planning',
    color: 'bg-purple-500',
    icon: '📊'
  },
  human_factors: {
    title: 'Human Performance & Limitations',
    description: 'Human factors in aviation and crew resource management',
    color: 'bg-orange-500',
    icon: '👥'
  },
  communication: {
    title: 'Communications',
    description: 'Radio communications and procedures',
    color: 'bg-cyan-500',
    icon: '📻'
  },
  meteorology: {
    title: 'Meteorology',
    description: 'Weather systems and aviation meteorology',
    color: 'bg-indigo-500',
    icon: '🌦️'
  },
  navigation: {
    title: 'Navigation',
    description: 'General and radio navigation techniques',
    color: 'bg-red-500',
    icon: '🧭'
  },
  operational_procedures: {
    title: 'Operational Procedures',
    description: 'Standard operating procedures and airline operations',
    color: 'bg-yellow-500',
    icon: '📋'
  },
  principles_flight: {
    title: 'Principles of Flight',
    description: 'Aerodynamics and flight theory',
    color: 'bg-pink-500',
    icon: '🛩️'
  }
};

// Comprehensive ATPL Subjects
const atplSubjects: AtplSubject[] = [
  // Air Law
  {
    id: 'air_law',
    title: 'Air Law',
    description: 'International and national aviation regulations, ICAO standards, and legal requirements',
    category: 'air_law',
    code: 'LAW',
    documents: [
      {
        id: 'airlaw_doc_1',
        title: 'ICAO Annexes and Standards',
        description: 'International Civil Aviation Organization standards and recommended practices',
        order: 1
      },
      {
        id: 'airlaw_doc_2',
        title: 'National Aviation Regulations',
        description: 'Country-specific aviation laws and regulations',
        order: 2
      }
    ],
    videos: [
      {
        id: 'airlaw_video_1',
        title: 'Introduction to Air Law',
        description: 'Overview of aviation legal framework',
        youtubeId: 'sample_youtube_id_1',
        duration: 1800,
        order: 1
      }
    ],
    questionCategories: ['emergency_procedures'],
    estimatedStudyHours: 40,
    difficulty: 'intermediate',
    order: 1
  },
  {
    id: 'air_law_2',
    title: 'Air Law 2',
    description: 'Advanced air law topics including operational requirements and licensing',
    category: 'air_law',
    code: 'LAW2',
    documents: [
      {
        id: 'airlaw2_doc_1',
        title: 'Operational Requirements',
        description: 'Commercial operations and airline regulations',
        order: 1
      }
    ],
    videos: [
      {
        id: 'airlaw2_video_1',
        title: 'Commercial Operations Law',
        description: 'Legal requirements for commercial aviation',
        youtubeId: 'sample_youtube_id_2',
        duration: 2100,
        order: 1
      }
    ],
    questionCategories: ['emergency_procedures'],
    estimatedStudyHours: 35,
    difficulty: 'advanced',
    prerequisites: ['air_law'],
    order: 2
  },

  // Aircraft General Knowledge - Airframes & Systems
  {
    id: 'aircraft_general_airframes_systems',
    title: 'Aircraft General Knowledge - Airframes & Systems',
    description: 'Aircraft structures, systems integration, and mechanical systems',
    category: 'aircraft_general',
    code: 'AGK-A',
    documents: [
      {
        id: 'agk_airframes_doc_1',
        title: 'Aircraft Structures',
        description: 'Airframe construction, materials, and structural design',
        order: 1
      },
      {
        id: 'agk_airframes_doc_2',
        title: 'Hydraulic and Pneumatic Systems',
        description: 'Fluid power systems in aircraft',
        order: 2
      }
    ],
    videos: [
      {
        id: 'agk_airframes_video_1',
        title: 'Aircraft Structure Fundamentals',
        description: 'Understanding aircraft construction principles',
        youtubeId: 'sample_youtube_id_3',
        duration: 2400,
        order: 1
      }
    ],
    questionCategories: ['performance'],
    estimatedStudyHours: 60,
    difficulty: 'intermediate',
    order: 3
  },
  {
    id: 'aircraft_general_airframes_systems_2',
    title: 'Aircraft General Knowledge - Airframes & Systems 2',
    description: 'Advanced aircraft systems and integration',
    category: 'aircraft_general',
    code: 'AGK-A2',
    documents: [
      {
        id: 'agk_airframes2_doc_1',
        title: 'Advanced Systems Integration',
        description: 'Complex aircraft systems and their interactions',
        order: 1
      }
    ],
    videos: [
      {
        id: 'agk_airframes2_video_1',
        title: 'Advanced Aircraft Systems',
        description: 'Complex system integration and troubleshooting',
        youtubeId: 'sample_youtube_id_4',
        duration: 2700,
        order: 1
      }
    ],
    questionCategories: ['performance'],
    estimatedStudyHours: 50,
    difficulty: 'advanced',
    prerequisites: ['aircraft_general_airframes_systems'],
    order: 4
  },

  // Aircraft General Knowledge - Electrics
  {
    id: 'aircraft_general_electrics',
    title: 'Aircraft General Knowledge - Electrics',
    description: 'Aircraft electrical systems, power generation, and distribution',
    category: 'aircraft_general',
    code: 'AGK-E',
    documents: [
      {
        id: 'agk_electrics_doc_1',
        title: 'Electrical Power Systems',
        description: 'AC/DC power generation and distribution in aircraft',
        order: 1
      },
      {
        id: 'agk_electrics_doc_2',
        title: 'Avionics and Electronic Systems',
        description: 'Electronic flight instruments and avionics integration',
        order: 2
      }
    ],
    videos: [
      {
        id: 'agk_electrics_video_1',
        title: 'Aircraft Electrical Systems',
        description: 'Understanding aircraft electrical power and distribution',
        youtubeId: 'sample_youtube_id_5',
        duration: 2200,
        order: 1
      }
    ],
    questionCategories: ['performance'],
    estimatedStudyHours: 45,
    difficulty: 'intermediate',
    order: 5
  },

  // Continue with other subjects...
  // Flight Performance & Planning
  {
    id: 'flight_performance_planning',
    title: 'Flight Performance & Planning',
    description: 'Aircraft performance calculations, flight planning, and operational considerations',
    category: 'flight_performance',
    code: 'FPP',
    documents: [
      {
        id: 'fpp_doc_1',
        title: 'Performance Calculations',
        description: 'Take-off, landing, and cruise performance calculations',
        order: 1
      },
      {
        id: 'fpp_doc_2',
        title: 'Flight Planning Procedures',
        description: 'Route planning, fuel calculations, and weather considerations',
        order: 2
      }
    ],
    videos: [
      {
        id: 'fpp_video_1',
        title: 'Flight Performance Fundamentals',
        description: 'Understanding aircraft performance characteristics',
        youtubeId: 'sample_youtube_id_6',
        duration: 3000,
        order: 1
      }
    ],
    questionCategories: ['performance', 'fuel_planning'],
    estimatedStudyHours: 80,
    difficulty: 'advanced',
    order: 6
  },

  // Navigation - General Navigation
  {
    id: 'navigation_general',
    title: 'Navigation - General Navigation',
    description: 'Basic navigation principles, chart reading, and position fixing',
    category: 'navigation',
    code: 'NAV-G',
    documents: [
      {
        id: 'nav_general_doc_1',
        title: 'Navigation Fundamentals',
        description: 'Basic navigation concepts and principles',
        order: 1
      },
      {
        id: 'nav_general_doc_2',
        title: 'Charts and Publications',
        description: 'Aeronautical charts and navigation publications',
        order: 2
      }
    ],
    videos: [
      {
        id: 'nav_general_video_1',
        title: 'Navigation Basics',
        description: 'Introduction to aviation navigation',
        youtubeId: 'sample_youtube_id_7',
        duration: 2800,
        order: 1
      }
    ],
    questionCategories: ['navigation'],
    estimatedStudyHours: 70,
    difficulty: 'intermediate',
    order: 7
  },

  // Meteorology
  {
    id: 'meteorology_atpl',
    title: 'Meteorology',
    description: 'Aviation weather, weather systems, and meteorological phenomena',
    category: 'meteorology',
    code: 'MET',
    documents: [
      {
        id: 'met_doc_1',
        title: 'Weather Systems',
        description: 'Understanding atmospheric systems and weather patterns',
        order: 1
      },
      {
        id: 'met_doc_2',
        title: 'Aviation Weather Reports',
        description: 'Weather reports, forecasts, and interpretation',
        order: 2
      }
    ],
    videos: [
      {
        id: 'met_video_1',
        title: 'Aviation Meteorology',
        description: 'Weather systems affecting aviation operations',
        youtubeId: 'sample_youtube_id_8',
        duration: 2600,
        order: 1
      }
    ],
    questionCategories: ['weather'],
    estimatedStudyHours: 65,
    difficulty: 'intermediate',
    order: 8
  },

  // Human Performance & Limitations
  {
    id: 'human_performance_limitations',
    title: 'Human Performance & Limitations',
    description: 'Human factors in aviation, physiology, and crew resource management',
    category: 'human_factors',
    code: 'HPL',
    documents: [
      {
        id: 'hpl_doc_1',
        title: 'Aviation Physiology',
        description: 'Human physiology in the aviation environment',
        order: 1
      },
      {
        id: 'hpl_doc_2',
        title: 'Crew Resource Management',
        description: 'CRM principles and human factors in flight operations',
        order: 2
      }
    ],
    videos: [
      {
        id: 'hpl_video_1',
        title: 'Human Factors in Aviation',
        description: 'Understanding human performance and limitations',
        youtubeId: 'sample_youtube_id_9',
        duration: 2400,
        order: 1
      }
    ],
    questionCategories: ['emergency_procedures'],
    estimatedStudyHours: 55,
    difficulty: 'intermediate',
    order: 9
  },

  // Principles of Flight
  {
    id: 'principles_flight',
    title: 'Principles of Flight',
    description: 'Aerodynamics, flight theory, and aircraft performance fundamentals',
    category: 'principles_flight',
    code: 'POF',
    documents: [
      {
        id: 'pof_doc_1',
        title: 'Basic Aerodynamics',
        description: 'Fundamental principles of flight and aerodynamics',
        order: 1
      },
      {
        id: 'pof_doc_2',
        title: 'Aircraft Performance Theory',
        description: 'Theoretical foundations of aircraft performance',
        order: 2
      }
    ],
    videos: [
      {
        id: 'pof_video_1',
        title: 'Aerodynamics Fundamentals',
        description: 'Basic principles of how aircraft fly',
        youtubeId: 'sample_youtube_id_10',
        duration: 3200,
        order: 1
      }
    ],
    questionCategories: ['performance'],
    estimatedStudyHours: 75,
    difficulty: 'intermediate',
    order: 10
  }
];

// Complete ATPL Curriculum
export const atplCurriculum: AtplCurriculum = {
  subjects: atplSubjects,
  categories: atplCategories
};

// Helper functions for working with curriculum data
export const getSubjectsByCategory = (category: AtplSubjectCategory): AtplSubject[] => {
  return atplSubjects.filter(subject => subject.category === category);
};

export const getSubjectById = (id: string): AtplSubject | undefined => {
  return atplSubjects.find(subject => subject.id === id);
};

export const getAllCategories = (): AtplSubjectCategory[] => {
  return Object.keys(atplCategories) as AtplSubjectCategory[];
};

export const getCategoryInfo = (category: AtplSubjectCategory) => {
  return atplCategories[category];
};