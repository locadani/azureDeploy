import React from 'react';
import { motion } from 'framer-motion';
import { ZINDEX } from '../../helperFiles/constants';

export function LinesDrawer({ toDrawLines, onAnimationCompleted }) {
  return (
    <div className="lines-drawer">
      {toDrawLines.map((line) => {
        const dx = line.endLocation.x - line.startLocation.x;
        const dy = line.endLocation.y - line.startLocation.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Angle in degrees

        return (
          <motion.div
            key={line.id}
            className="line"
            style={{
              position: 'absolute',
              left: `${line.startLocation.x}px`,
              top: `${line.startLocation.y - line.width / 2}px`,
              width: `${length}px`,
              zIndex: ZINDEX.LINES, // Ensure it's above clickable div and below the accounts
              height: `${line.width}px`,
              backgroundColor: line.color,
              transform: `rotate(${angle}deg)`,
              transformOrigin: '0 50%', // Rotate around the start point
              borderRadius: '6px',
            }}
            initial={{
              zIndex: ZINDEX.LINES,
            }}
            animate={{
              zIndex: ZINDEX.LINES,
            }}
            transition={{
              zIndex: {
                delay: line.lineDuration,
              },
            }}
            onAnimationComplete={() => {
              onAnimationCompleted(line.id);
            }}
          />
        );
      })}
    </div>
  );
}
