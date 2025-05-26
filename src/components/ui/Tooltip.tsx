"use client";

import { useState, useRef, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const positionStyles = {
    top: {
      top: mousePosition.y - 10,
      left: mousePosition.x,
      transform: 'translate(-50%, -100%)'
    },
    right: {
      top: mousePosition.y,
      left: mousePosition.x + 10,
      transform: 'translateY(-50%)'
    },
    bottom: {
      top: mousePosition.y + 10,
      left: mousePosition.x,
      transform: 'translate(-50%, 0)'
    },
    left: {
      top: mousePosition.y,
      right: window.innerWidth - mousePosition.x + 10,
      transform: 'translateY(-50%)'
    }
  };

  const arrowStyles = {
    top: {
      bottom: '-6px',
      left: '50%',
      marginLeft: '-6px',
      transform: 'rotate(45deg)'
    },
    right: {
      left: '-6px',
      top: '50%',
      marginTop: '-6px',
      transform: 'rotate(-45deg)'
    },
    bottom: {
      top: '-6px',
      left: '50%',
      marginLeft: '-6px',
      transform: 'rotate(-135deg)'
    },
    left: {
      right: '-6px',
      top: '50%',
      marginTop: '-6px',
      transform: 'rotate(135deg)'
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed z-50 px-4 py-3 text-sm bg-gray-900 text-white rounded-lg shadow-lg whitespace-normal"
            style={{
              ...positionStyles[position],
              maxWidth: 'none' // Allow the tooltip to be as wide as needed
            }}
          >
            {/* Arrow */}
            <div
              className="absolute w-3 h-3 bg-gray-900"
              style={arrowStyles[position]}
            />
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 