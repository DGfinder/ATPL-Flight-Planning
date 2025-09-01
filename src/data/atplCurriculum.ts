import type { AtplCurriculum, AtplSubject, AtplSubjectCategory } from '../types';

const TAS_THEORY_CONTENT = `TAS, Heading and Ground Speed determinations using the flight computer

Learning how to use the flight computer is one of the basic elements that student pilots are taught during the initial stages of training. It is very important to remain confident using the computer (whiz wheel) as setting it up can sometimes be confusing if you are out of practice. However, it is very simple and produces accurate results if used correctly. You must be familiar with using the computer to obtain the wind components and drift.

This is also a good time to review Effective True Air Speed (ETAS) as it can play a significant role in ATPL flight planning. If we have a significant amount of crosswind resulting in a sizable drift angle, the TAS along the track made good will be less than the aircraft actual TAS. This is what we call Effective True Air Speed (ETAS). Historically it has been considered that up to 10° of drift angle, the difference between TAS and ETAS is not significant. However, for ATPL flight planning we need to consider any drift angle of more than 5° as stated in the ATPL Examination Guide from CASA.

Example Calculation:

Given:
FPT 225°
TAS 350 knots
W/V 190° / 90 kts (not unusual at high altitude)

Calculate the HOG and GS

Step 1. Set TAS over the TAS mark
Step 2. Rotate the inner whiz wheel and mark a wind speed and direction at 90 knots up from the centre of the wheel on 190°
Step 3. Rotate the inner whiz wheel till the FTP (225°) is up from the centre
Step 4. Read off the nav computer 53 knots of crosswind from the left and 72 knots of head wind
Step 5. Convert the crosswind to a drift angle of 8°
Step 6. Now look to the left of the TAS arrow 8° and read off ETAS 345 knots
Step 7. Subtract the 72 knots of head wind from the ETAS to get a ground speed of 273 knots

You can see on the previous page, if we hadn't corrected for ETAS, the ground speed would have been out by 10 kts. High altitude winds can often be in excess of 100 kts so it is easy to see how our flight planning can be affected by ETAS if it is not used correctly.

For the purposes of flight planning, we combine the reduction of ETAS and our wind component together to give us a Wind Component (WC).

For example, if our TAS was reduced from 400kts to 395kts, it is the equivalent to a 5 knot headwind which can then be combined with our regular headwind/tailwind.

Note: ETAS will always be reduction - it will always slow you down.`;

// Flight Planning Categories
const atplCategories: Record<AtplSubjectCategory, {
  title: string;
  description: string;
  color: string;
  icon: string;
}> = {
  flight_performance: {
    title: 'Flight Performance & Planning',
    description: 'Boeing 727 flight planning, performance calculations, and operational procedures',
    color: 'bg-aviation-primary',
    icon: 'FPL'
  }
};

// Flight Planning Textbook Topics
const atplSubjects: AtplSubject[] = [
  // TAS, Heading and Ground Speed determinations
  {
    id: 'tas_heading_ground_speed',
    title: 'TAS, Heading and Ground Speed determinations using the flight computer',
    description: 'Learn flight computer usage, wind components, drift, and Effective True Air Speed (ETAS) calculations',
    category: 'flight_performance',
    code: 'FP01',
    documents: [
      {
        id: 'tas_theory',
        title: 'Flight Computer Theory',
        description: TAS_THEORY_CONTENT,
        order: 1
      }
    ],
    videos: [
      {
        id: 'tas_video_1',
        title: 'TAS, Heading and Ground Speed - Flight Computer Tutorial',
        description: 'Comprehensive tutorial on using the flight computer for TAS, heading, and ground speed calculations including ETAS considerations',
        youtubeId: 'nLjsPMARlu8',
        duration: 0,
        order: 1
      }
    ],
    questionCategories: ['navigation', 'performance'],
    estimatedStudyHours: 8,
    difficulty: 'intermediate',
    order: 1
  },
  {
    id: 'speed_sound_mach_tat',
    title: 'The Speed of Sound and Mach Numbers, Total Air Temperature',
    description: 'Understanding speed of sound, Mach number calculations, and total air temperature effects',
    category: 'flight_performance',
    code: 'FP02',
    documents: [],
    videos: [],
    questionCategories: ['performance'],
    estimatedStudyHours: 6,
    difficulty: 'intermediate',
    order: 2
  },
  {
    id: 'route_sector_winds_temp',
    title: 'Route Sector Winds and Temperature (RSWT)',
    description: 'Route planning using sector winds and temperature data',
    category: 'flight_performance',
    code: 'FP03',
    documents: [],
    videos: [],
    questionCategories: ['navigation', 'weather'],
    estimatedStudyHours: 5,
    difficulty: 'intermediate',
    order: 3
  },
  {
    id: 'magnetic_variation',
    title: 'Magnetic Variation',
    description: 'Understanding and applying magnetic variation in flight planning',
    category: 'flight_performance',
    code: 'FP04',
    documents: [],
    videos: [],
    questionCategories: ['navigation'],
    estimatedStudyHours: 4,
    difficulty: 'beginner',
    order: 4
  },
  {
    id: 'ins_data',
    title: 'INS Data',
    description: 'Inertial Navigation System data and applications',
    category: 'flight_performance',
    code: 'FP05',
    documents: [],
    videos: [],
    questionCategories: ['navigation'],
    estimatedStudyHours: 6,
    difficulty: 'advanced',
    order: 5
  },
  {
    id: 'climb_tables',
    title: 'Climb Tables',
    description: 'Using climb performance tables for flight planning',
    category: 'flight_performance',
    code: 'FP06',
    documents: [],
    videos: [],
    questionCategories: ['performance'],
    estimatedStudyHours: 8,
    difficulty: 'intermediate',
    order: 6
  },
  {
    id: 'descent_tables',
    title: 'Descent Tables',
    description: 'Using descent performance tables and planning descents',
    category: 'flight_performance',
    code: 'FP07',
    documents: [],
    videos: [],
    questionCategories: ['performance'],
    estimatedStudyHours: 8,
    difficulty: 'intermediate',
    order: 7
  },
  {
    id: 'altitude_capability',
    title: 'Altitude Capability',
    description: 'Aircraft altitude limitations and capability charts',
    category: 'flight_performance',
    code: 'FP08',
    documents: [],
    videos: [],
    questionCategories: ['performance'],
    estimatedStudyHours: 6,
    difficulty: 'intermediate',
    order: 8
  },
  {
    id: 'cruise_data',
    title: 'Cruise Data',
    description: 'Cruise performance data and optimization',
    category: 'flight_performance',
    code: 'FP09',
    documents: [],
    videos: [],
    questionCategories: ['performance'],
    estimatedStudyHours: 7,
    difficulty: 'intermediate',
    order: 9
  },
  {
    id: 'buffet_boundary_charts',
    title: 'Buffet Boundary Charts',
    description: 'Understanding and using buffet boundary limitations',
    category: 'flight_performance',
    code: 'FP10',
    documents: [],
    videos: [],
    questionCategories: ['performance'],
    estimatedStudyHours: 5,
    difficulty: 'advanced',
    order: 10
  },
  {
    id: 'flight_planning_basics',
    title: 'Flight Planning Basics',
    description: 'Fundamentals of flight planning procedures and requirements',
    category: 'flight_performance',
    code: 'FP11',
    documents: [],
    videos: [],
    questionCategories: ['fuel_planning', 'navigation'],
    estimatedStudyHours: 10,
    difficulty: 'beginner',
    order: 11
  },
  {
    id: 'real_flight_plans',
    title: 'Real Flight Plans',
    description: 'Working with actual flight plans and real-world scenarios',
    category: 'flight_performance',
    code: 'FP12',
    documents: [],
    videos: [],
    questionCategories: ['fuel_planning', 'navigation'],
    estimatedStudyHours: 12,
    difficulty: 'intermediate',
    order: 12
  },
  {
    id: 'step_climbs',
    title: 'Step Climbs',
    description: 'Planning and executing step climb procedures',
    category: 'flight_performance',
    code: 'FP13',
    documents: [],
    videos: [],
    questionCategories: ['performance', 'fuel_planning'],
    estimatedStudyHours: 6,
    difficulty: 'intermediate',
    order: 13
  },
  {
    id: 'backwards_flight_plans',
    title: 'Backwards Flight Plans',
    description: 'Reverse flight planning techniques and applications',
    category: 'flight_performance',
    code: 'FP14',
    documents: [],
    videos: [],
    questionCategories: ['fuel_planning', 'navigation'],
    estimatedStudyHours: 8,
    difficulty: 'advanced',
    order: 14
  },
  {
    id: 'max_payload_min_fuel_abnormal',
    title: 'Maximum Payload and Minimum Fuel Flight Plans & Abnormal Operations',
    description: 'Optimizing payload and fuel planning for abnormal operations',
    category: 'flight_performance',
    code: 'FP15',
    documents: [],
    videos: [],
    questionCategories: ['fuel_planning', 'weight_balance'],
    estimatedStudyHours: 10,
    difficulty: 'advanced',
    order: 15
  },
  {
    id: 'depressurised_flight',
    title: 'Depressurised Flight',
    description: 'Flight planning and procedures for depressurization scenarios',
    category: 'flight_performance',
    code: 'FP16',
    documents: [],
    videos: [],
    questionCategories: ['emergency_procedures', 'performance'],
    estimatedStudyHours: 6,
    difficulty: 'advanced',
    order: 16
  },
  {
    id: 'yaw_damper_inoperative',
    title: 'Yaw Damper Inoperative Flight',
    description: 'Flight planning and procedures with inoperative yaw damper',
    category: 'flight_performance',
    code: 'FP17',
    documents: [],
    videos: [],
    questionCategories: ['emergency_procedures', 'performance'],
    estimatedStudyHours: 5,
    difficulty: 'advanced',
    order: 17
  },
  {
    id: 'tailskid_extended',
    title: 'Operation with the Tailskid extended',
    description: 'Flight procedures and performance with extended tailskid',
    category: 'flight_performance',
    code: 'FP18',
    documents: [],
    videos: [],
    questionCategories: ['emergency_procedures', 'performance'],
    estimatedStudyHours: 4,
    difficulty: 'advanced',
    order: 18
  },
  {
    id: 'landing_gear_extended',
    title: 'Landing Gear extended flight',
    description: 'Flight planning and performance with gear extended',
    category: 'flight_performance',
    code: 'FP19',
    documents: [],
    videos: [],
    questionCategories: ['emergency_procedures', 'performance'],
    estimatedStudyHours: 5,
    difficulty: 'advanced',
    order: 19
  },
  {
    id: 'one_engine_inoperative',
    title: 'One Engine In-Operative Flight',
    description: 'Single-engine operations and performance planning',
    category: 'flight_performance',
    code: 'FP20',
    documents: [],
    videos: [],
    questionCategories: ['emergency_procedures', 'performance'],
    estimatedStudyHours: 10,
    difficulty: 'advanced',
    order: 20
  },
  {
    id: 'fuel_dumping',
    title: 'Fuel Dumping',
    description: 'Fuel dumping procedures and calculations',
    category: 'flight_performance',
    code: 'FP21',
    documents: [],
    videos: [],
    questionCategories: ['emergency_procedures', 'fuel_planning'],
    estimatedStudyHours: 4,
    difficulty: 'intermediate',
    order: 21
  },
  {
    id: 'holding_fuel',
    title: 'Holding Fuel',
    description: 'Fuel calculations for holding patterns and delays',
    category: 'flight_performance',
    code: 'FP22',
    documents: [],
    videos: [],
    questionCategories: ['fuel_planning'],
    estimatedStudyHours: 6,
    difficulty: 'intermediate',
    order: 22
  },
  {
    id: 'company_fuel_policy',
    title: 'The Company Fuel Policy',
    description: 'Understanding airline fuel policies and procedures',
    category: 'flight_performance',
    code: 'FP23',
    documents: [],
    videos: [],
    questionCategories: ['fuel_planning'],
    estimatedStudyHours: 4,
    difficulty: 'beginner',
    order: 23
  },
  {
    id: 'minimum_fuel_requirements',
    title: 'Minimum Fuel Requirements',
    description: 'Regulatory minimum fuel requirements and calculations',
    category: 'flight_performance',
    code: 'FP24',
    documents: [],
    videos: [],
    questionCategories: ['fuel_planning'],
    estimatedStudyHours: 6,
    difficulty: 'intermediate',
    order: 24
  },
  {
    id: 'minimum_aerodrome_standards',
    title: 'Minimum Aerodrome Standards',
    description: 'Aerodrome requirements and standards for operations',
    category: 'flight_performance',
    code: 'FP25',
    documents: [],
    videos: [],
    questionCategories: ['navigation'],
    estimatedStudyHours: 5,
    difficulty: 'intermediate',
    order: 25
  },
  {
    id: 'inflight_replanning',
    title: 'In-Flight Re-Planning',
    description: 'Techniques for modifying flight plans during flight',
    category: 'flight_performance',
    code: 'FP26',
    documents: [],
    videos: [],
    questionCategories: ['fuel_planning', 'navigation'],
    estimatedStudyHours: 8,
    difficulty: 'advanced',
    order: 26
  },
  {
    id: 'boeing_727_weight_limits',
    title: 'Boeing 727 maximum weight limitations',
    description: 'Weight and balance limitations specific to Boeing 727',
    category: 'flight_performance',
    code: 'FP27',
    documents: [],
    videos: [],
    questionCategories: ['weight_balance'],
    estimatedStudyHours: 6,
    difficulty: 'intermediate',
    order: 27
  },
  {
    id: 'destination_alternate_fuel',
    title: 'Destination - Alternate Fuel Policy',
    description: 'Fuel planning for destination and alternate airports',
    category: 'flight_performance',
    code: 'FP28',
    documents: [],
    videos: [],
    questionCategories: ['fuel_planning'],
    estimatedStudyHours: 7,
    difficulty: 'intermediate',
    order: 28
  },
  {
    id: 'equi_time_point',
    title: 'Equi-Time Point (Critical Point)',
    description: 'Calculating and understanding critical points in flight planning',
    category: 'flight_performance',
    code: 'FP29',
    documents: [],
    videos: [],
    questionCategories: ['navigation', 'fuel_planning'],
    estimatedStudyHours: 8,
    difficulty: 'advanced',
    order: 29
  },
  {
    id: 'point_no_return',
    title: 'Point of No Return (PNR)',
    description: 'Calculating point of no return for safe flight operations',
    category: 'flight_performance',
    code: 'FP30',
    documents: [],
    videos: [],
    questionCategories: ['navigation', 'fuel_planning'],
    estimatedStudyHours: 8,
    difficulty: 'advanced',
    order: 30
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