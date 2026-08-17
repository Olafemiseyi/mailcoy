import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  activeKey?: string;
}

export default function PageTransition({ children, activeKey }: PageTransitionProps) {
  return (
    <motion.div
      key={activeKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex-1"
    >
      {children}
    </motion.div>
  );
}
