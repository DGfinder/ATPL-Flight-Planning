# ATPL Flight Planning Study Tool

A comprehensive interactive study application for ATPL (Airline Transport Pilot License) flight planning exams. Features both multiple choice and short answer questions with tolerance-based validation, performance tracking, and an interactive flight planning sheet.

## Features

### Question Types
- **Multiple Choice Questions**: Radio button selection with immediate visual feedback
- **Short Answer Questions**: Numerical inputs with tolerance-based validation (±2nm, ±50kg, ±0.01 Mach, etc.)
- **Interactive Flight Planning Sheet**: Editable table with auto-calculations and export functionality

### Study Modes
- **Practice Mode**: Immediate feedback after each question
- **Exam Mode**: Feedback only at the end of the session

### Progress Tracking
- Real-time progress bar and accuracy metrics
- Category-specific performance breakdown
- Session timer and average time per question
- Local storage persistence across sessions

### Aviation Calculations
- Wind triangle calculations
- Mach/TAS conversions  
- Fuel planning computations
- Weight and balance calculations
- Pressure and density altitude

### Categories Covered
- Aircraft Performance
- Navigation & Flight Planning
- Fuel Planning
- Weight & Balance
- Meteorology
- Flight Planning Procedures

## Sample Questions Included

- **AFPA_001**: TMN cruise schedule performance calculation
- **AFPA_015**: Wind correction analysis with forecast vs actual conditions
- **AFPA_023**: Pressure altitude for Mach number determination
- **AFPA_008**: Fuel planning with reserve requirements
- **AFPA_012**: Weight and balance center of gravity calculation

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ATPL-Flight-Planning

# Install dependencies  
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Usage

1. **Select Study Mode**: Choose between Practice (immediate feedback) or Exam mode
2. **Filter by Category**: Focus on specific areas like Performance or Navigation
3. **Answer Questions**: Work through multiple choice and short answer questions
4. **Track Progress**: Monitor your accuracy and time spent via the analytics dashboard
5. **Use Flight Plan Tool**: Practice with the interactive flight planning sheet
6. **Export Data**: Save your progress and performance metrics

## Project Structure

```
src/
├── components/
│   ├── questions/          # Question display components
│   ├── ui/                # UI components (dashboard, settings)
│   ├── flight-plan/       # Flight planning sheet component
│   └── FlightPlanningApp.tsx
├── types/                 # TypeScript interfaces
├── utils/                 # Aviation calculations and storage
├── data/                  # Sample questions database
├── hooks/                 # Custom React hooks
└── stores/               # State management
```

## Technical Details

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom aviation theme
- **Persistence**: Local Storage for progress and settings
- **Calculations**: Custom aviation mathematics utilities
- **Validation**: Tolerance-based answer checking for realistic assessment

## Aviation Calculations Supported

- Wind triangle (track, drift, groundspeed)
- True airspeed and Mach number conversions
- Fuel flow and consumption calculations  
- Center of gravity and weight distribution
- Pressure altitude and ISA deviations
- Time and distance relationships

## Study Features

### Tolerance-Based Validation
Short answer questions use realistic tolerances:
- Distance: ±2nm
- Weight: ±50kg  
- Speed: ±5kt
- Mach: ±0.01
- Time: ±1 minute

### Performance Analytics
- Overall accuracy percentage
- Category-specific performance breakdown
- Time management metrics
- Progress tracking charts
- Export capability for external analysis

### Customizable Settings
- Default study mode preference
- Auto-advance on correct answers
- Working steps visibility
- Data export and reset options

## Contributing

This tool is designed for aviation students preparing for ATPL examinations. The question database can be expanded by adding new entries to `src/data/questions.ts` following the established format.

## License

Built for educational purposes supporting aviation training.
