import React from 'react';
import { motion } from 'motion/react';
import { CardData, Suit } from '../types';
import { SUIT_COLORS, SUIT_SYMBOLS } from '../constants';
import { cn } from '../utils/cn';

interface CardProps {
  card?: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  index?: number;
}

export const Card: React.FC<CardProps> = ({
  card,
  isFaceUp = true,
  onClick,
  isPlayable = false,
  className,
  index = 0,
}) => {
  if (isFaceUp && !card) return null;

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        'relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl shadow-xl transition-all duration-300 cursor-default select-none',
        isFaceUp ? 'bg-white' : 'bg-indigo-600 border-4 border-white/20',
        isPlayable && 'cursor-pointer ring-4 ring-emerald-400 ring-offset-2 ring-offset-zinc-950',
        !isFaceUp && 'bg-[repeating-linear-gradient(45deg,#4f46e5,#4f46e5_10px,#4338ca_10px,#4338ca_20px)]',
        className
      )}
    >
      {isFaceUp && card ? (
        <div className={cn('flex flex-col h-full p-2 sm:p-4', SUIT_COLORS[card.suit])}>
          <div className="flex justify-between items-start">
            <span className="text-lg sm:text-2xl font-bold font-display leading-none">
              {card.rank}
            </span>
            <span className="text-lg sm:text-2xl leading-none">
              {SUIT_SYMBOLS[card.suit]}
            </span>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-4xl sm:text-6xl">
            {SUIT_SYMBOLS[card.suit]}
          </div>
          
          <div className="flex justify-between items-end rotate-180">
            <span className="text-lg sm:text-2xl font-bold font-display leading-none">
              {card.rank}
            </span>
            <span className="text-lg sm:text-2xl leading-none">
              {SUIT_SYMBOLS[card.suit]}
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10" />
          </div>
        </div>
      )}
    </motion.div>
  );
};
