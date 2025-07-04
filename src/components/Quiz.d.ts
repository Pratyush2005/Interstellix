declare module '@/components/Quiz' {
  import * as React from 'react';

  export interface QuizProps {
    isOpen: boolean;
    onClose: () => void;
    onUserInteraction?: () => void;
  }

  const Quiz: React.FC<QuizProps>;
  export default Quiz;
}
