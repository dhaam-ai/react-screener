# React & Tailwind Screening Interview App

A Next.js application for conducting technical screening interviews with React v19 and Tailwind CSS v4 questions.

## Features

### 🎯 Core Functionality
- **Email Collection**: Initial screen to capture user email
- **10 Technical Questions**: 5 React v19 + 5 Tailwind CSS v4 questions
- **One-Question-at-a-Time Flow**: Progressive interview experience
- **Google Sheets Integration**: Automatic submission of responses

### ⏱️ Enhanced Timer System
- **Individual Question Timers**: 
  - React questions: 4 minutes each
  - Tailwind questions: 3 minutes each
- **Persistent Timer State**: Timers continue across page refreshes
- **Question Navigation**: Navigate between previously accessed questions
- **Timer Expiry Handling**: 
  - Questions become read-only when timer expires
  - Can still navigate to other questions
  - Expired answers are preserved
- **Auto-submission**: Automatically submits when all accessed question timers expire
- **Visual Timer Indicators**:
  - Circular progress timer
  - Color changes: Green → Orange (30s) → Red (10s)
  - Progress bar shows timer status for all questions

### 🎨 UI/UX Features
- **Professional Design**: Clean, minimal interview interface
- **shadcn/ui Components**: Polished UI components
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Progress Tracking**: Visual progress bar with timer indicators

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to the screening directory
cd screening

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start the interview.

## How It Works

1. **Start Interview**: Enter email on landing page
2. **Answer Questions**: 
   - Timer starts automatically for each question
   - Type your answer in the text area
   - Submit before timer expires or answer becomes read-only
3. **Navigation**:
   - Use "Next Question" to proceed forward
   - Use "← Go to previous question" to review previous questions
   - Can only access questions you've already visited
4. **Timer Management**:
   - Each question has its own timer
   - Timers persist across page refreshes
   - Expired questions show "Time Expired" status
   - Can still navigate and view expired questions
5. **Submission**:
   - Manual: Click "Finish Interview" on last question
   - Automatic: When all accessed question timers expire
   - Results sent to configured Google Sheets

## Timer Status Indicators

- 🟢 **Green**: Active timer with plenty of time
- 🟠 **Orange**: Low time warning (< 30 seconds)
- 🔴 **Red**: Critical time (< 10 seconds)
- ⚫ **Gray**: Question not yet accessed
- 🔴 **Dark Red**: Timer expired

## Technical Implementation

### State Management
- Session data stored in localStorage
- Timer states calculated using timestamps
- Automatic state synchronization across tabs

### Key Components
- `Timer.tsx`: Visual countdown timer with persistence
- `QuestionCard.tsx`: Question display with answer input
- `ProgressBar.tsx`: Progress tracking with timer indicators
- `api.ts`: Session management and Google Sheets integration

### Data Flow
1. Session created with email
2. Timer initialized when question first accessed
3. Timer state updated every second
4. Answers saved to session on submission
5. Complete session submitted to Google Sheets

## Configuration

### Google Sheets API
The app submits to a pre-configured Google Sheets endpoint. To use your own:

1. Update `API_ENDPOINT` in `lib/api.ts`
2. Ensure your Google Sheets accepts the submission format

### Question Timing
Modify time limits in `lib/questions.ts`:
```typescript
timeLimit: 240 // 4 minutes in seconds
```

## Testing Tips

1. **Test Timer Persistence**: Refresh page during a question
2. **Test Navigation**: Go back to previous questions
3. **Test Expiry**: Let a timer run out
4. **Test Auto-submission**: Let all timers expire
5. **Test Edge Cases**: Close/reopen browser, network issues

## Troubleshooting

### Timer Not Updating
- Check browser console for errors
- Ensure localStorage is enabled
- Clear localStorage and restart

### Navigation Issues
- Can only access previously visited questions
- Check highestQuestionAccessed in session

### Submission Failures
- Check network connection
- Verify Google Sheets API endpoint
- Check browser console for API errors

## Architecture

```
screening/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── question/[id]/     # Dynamic question pages
│   └── success/           # Completion page
├── components/            # React components
│   ├── Timer.tsx         # Persistent timer
│   ├── QuestionCard.tsx  # Question display
│   └── ProgressBar.tsx   # Progress tracking
├── lib/                  # Utilities
│   ├── api.ts           # Session & API management
│   └── questions.ts     # Question data
└── types/               # TypeScript types
