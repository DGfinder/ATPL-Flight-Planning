import type { Question, QuestionCategory } from '../types';

export const sampleQuestions: Question[] = [
  {
    id: "AFPA_016",
    title: "B727 Sector Fuel Burn - DARWIN to PORT MORESBY",
    description: "A flight is being planned in a B727 from DARWIN to PORT MORESBY via route B598. The planned FBO from IDELU to HORN ISLAND is closest to -",
    type: "short_answer",
    category: "fuel_planning",
    marks: 2,
    givenData: {
      "GW overhead IDELU": "72,500 kg",
      "FL": "330",
      "TMN": "LRC",
      "Forecast for FL340": "W/V 170T/14",
      "SAT for FL340": "-39°C"
    },
    expectedAnswers: [
      {
        field: "fuel_burn",
        value: 3174,
        tolerance: 50,
        unit: "kg",
        description: "Planned FBO from IDELU to HORN ISLAND"
      }
    ],
    workingSteps: [],
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(d) Sector Fuel Burn"
  }
];

export const questionCategories: Record<QuestionCategory, string> = {
  performance: 'Aircraft Performance',
  navigation: 'Navigation & Flight Planning',
  fuel_planning: 'Fuel Planning',
  weight_balance: 'Weight & Balance',
  weather: 'Weather & Meteorology',
  emergency_procedures: 'Emergency Procedures'
};