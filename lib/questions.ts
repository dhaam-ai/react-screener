import { Question } from '@/types';

export const questions: Question[] = [
  // React v19 Questions
  {
    id: 1,
    category: 'React v19',
    level: 'Intermediate',
    question: 'What does the useOptimistic hook enable, and how does it improve user experience?',
    expectedAnswer: 'It allows rendering an optimistic UI state while awaiting async mutations. This enhances responsiveness by reflecting intended changes immediately before the server responds.',
    timeLimit: 240 // 4 minutes
  },
  {
    id: 2,
    category: 'React v19',
    level: 'Advanced',
    question: 'Explain how useActionState differs from useState in managing form submissions.',
    expectedAnswer: 'useActionState integrates async logic and pending/error states into a single hook for form mutations, simplifying error handling and submission feedback.',
    timeLimit: 240
  },
  {
    id: 3,
    category: 'React v19',
    level: 'Advanced',
    question: 'React 19 introduces a new way to use ref in function components. What is it and how does it replace forwardRef?',
    expectedAnswer: 'Function components can now directly receive a ref prop without forwardRef, simplifying component definitions and improving type inference.',
    timeLimit: 240
  },
  {
    id: 4,
    category: 'React v19',
    level: 'Advanced',
    question: 'How does the <form action={serverAction}> pattern in React 19 simplify mutation logic compared to traditional event handling?',
    expectedAnswer: 'It eliminates manual event handling and fetch calls by allowing direct server function binding to form actions, ensuring server-side validation and mutation in one network round-trip.',
    timeLimit: 240
  },
  {
    id: 5,
    category: 'React v19',
    level: 'Advanced',
    question: 'React 19 introduces the use function. What are two key use cases where use() enhances rendering flow?',
    expectedAnswer: '(1) Suspending rendering until promises resolve (e.g., use(promise) inside Suspense), (2) accessing context values conditionally during render without using useContext.',
    timeLimit: 240
  },
  // Tailwind CSS v4 Questions
  {
    id: 6,
    category: 'Tailwind CSS v4',
    level: 'Junior',
    question: 'What is the benefit of Tailwind v4\'s CSS-first configuration approach?',
    expectedAnswer: 'It allows configuring theme tokens and utilities directly in the CSS file using @theme, reducing reliance on tailwind.config.js and simplifying setup.',
    timeLimit: 180 // 3 minutes
  },
  {
    id: 7,
    category: 'Tailwind CSS v4',
    level: 'Intermediate',
    question: 'How do container queries in Tailwind CSS v4 improve responsive design?',
    expectedAnswer: 'They enable styling based on a component\'s container size using @container and @min-*, @max-* variants, which allows more modular, responsive components.',
    timeLimit: 180
  },
  {
    id: 8,
    category: 'Tailwind CSS v4',
    level: 'Junior',
    question: 'What does automatic content detection do in Tailwind CSS v4?',
    expectedAnswer: 'It removes the need to manually configure the content array in tailwind.config.js, by auto-detecting template files and excluding common ignored files.',
    timeLimit: 180
  },
  {
    id: 9,
    category: 'Tailwind CSS v4',
    level: 'Intermediate',
    question: 'How does Tailwind CSS v4 use modern CSS features like @property and cascade layers?',
    expectedAnswer: 'These features improve performance and control—@property enables animating custom properties, and cascade layers improve CSS predictability and overrides.',
    timeLimit: 180
  },
  {
    id: 10,
    category: 'Tailwind CSS v4',
    level: 'Junior',
    question: 'What are dynamic utility values in Tailwind v4 and how do they enhance flexibility?',
    expectedAnswer: 'They allow arbitrary utility values using a consistent spacing/token system, e.g., w-17 for dynamic widths without needing manual config extensions.',
    timeLimit: 180
  }
];

export function getQuestionById(id: number): Question | undefined {
  return questions.find(q => q.id === id);
}

export function getTotalQuestions(): number {
  return questions.length;
}
