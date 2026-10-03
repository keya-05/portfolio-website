import { MotionConfig } from 'framer-motion';
import { GameProvider } from './components/shell/GameContext';
import { GameShell } from './components/shell/GameShell';
import { ToastProvider } from './components/ui/Toast';

export default function App() {
  return (
    // reducedMotion="user": Framer drops transform animations when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <GameProvider>
        <ToastProvider>
          <GameShell />
        </ToastProvider>
      </GameProvider>
    </MotionConfig>
  );
}
