import React from 'react';
import { motion } from 'framer-motion';
import {
  drawTrail,
  transparency,
  ZINDEX,
} from '../../helperFiles/constants.js';

const CirclesDrawer = ({
  circles,
  onAnimationStarted,
  onAnimationCompleted,
}) => {
  return (
    <div className="circleAnimation">
      {circles.map((circle) => {
        if (drawTrail) {
          return (
            <motion.div
              key={circle.id}
              layoutId={circle.id}
              style={{
                position: 'absolute',
                zIndex: ZINDEX.CIRCLES, // Ensure it's above clickable div and below the accounts
                top: circle.startY - circle.radius,
                left: circle.startX - circle.radius,
                width: circle.radius * 2,
                height: circle.radius * 2,
                borderRadius: '50%',
                backgroundColor: circle.color
                  .replace('rgb', 'rgba')
                  .replace(')', ', ' + transparency + ')'),
              }}
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: 0.1,
                x: [0, circle.endX - circle.startX],
                y: [0, circle.endY - circle.startY],
              }}
              transition={{
                x: {
                  duration: circle.duration,
                  delay: circle.delay,
                },
                y: {
                  duration: circle.duration,
                  delay: circle.delay,
                },
                opacity: {
                  duration: circle.duration,
                  delay: circle.delay,
                },
              }}
              onAnimationStart={() => {
                if (circle.isFirstOrLast)
                  onAnimationStarted(circle.account, circle.amount);
              }}
              onAnimationComplete={() => {
                if (circle.isFirstOrLast)
                  onAnimationCompleted(
                    circle.id,
                    circle.account,
                    circle.amount
                  );
              }}
            ></motion.div>
          );
        } else {
          return (
            <motion.div
              key={circle.id}
              layoutId={circle.id}
              style={{
                position: 'absolute',
                top: circle.startY - circle.radius,
                left: circle.startX - circle.radius,
                width: circle.radius * 2,
                height: circle.radius * 2,
                zIndex: ZINDEX.CIRCLES, // Ensure it's above clickable div and the lines, but below the accounts
                borderRadius: '50%',
                background: `
                  radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 1), ${circle.color} 40%, rgba(255, 255, 255, 0.3) 100%)
                `,
                boxShadow: `
                  inset 0 0 20px rgba(255, 255, 255, 0.3) /* Subtle inner glow to make it appear illuminated */
                `,
              }}
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: 1,
                x: [0, circle.endX - circle.startX],
                y: [0, circle.endY - circle.startY],
              }}
              transition={{
                opacity: { delay: circle.delay, duration: 0 }, // Delay visibility without fading from 0 to 1
                duration: circle.duration,
                delay: circle.delay,
              }}
              onAnimationStart={() => {
                onAnimationStarted(circle.account, circle.amount);
              }}
              onAnimationComplete={() => {
                onAnimationCompleted(circle.id, circle.account, circle.amount);
              }}
            />
          );
        }
      })}
    </div>
  );
};

export default CirclesDrawer;
