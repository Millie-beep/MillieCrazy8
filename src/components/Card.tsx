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

const ZODIAC_ANIMALS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];

export const Card: React.FC<CardProps> = ({
  card,
  isFaceUp = true,
  onClick,
  isPlayable = false,
  className,
  index = 0,
}) => {
  if (isFaceUp && !card) return null;

  // Use a consistent zodiac animal based on the card's ID for the back
  const zodiacIndex = card?.id ? (card.id.length % 12) : (index % 12);
  const animal = ZODIAC_ANIMALS[zodiacIndex];
  const backImageUrl = `https://picsum.photos/seed/${animal}/200/300`;

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        'relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl shadow-xl transition-all duration-300 cursor-default select-none overflow-hidden',
        isFaceUp ? 'bg-white' : 'bg-red-900 border-4 border-yellow-500/50',
        isPlayable && 'cursor-pointer ring-4 ring-emerald-400 ring-offset-2 ring-offset-zinc-950',
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
        <div className="w-full h-full relative">
          <img 
            src={backImageUrl} 
            alt="Card Back" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-yellow-500/30 flex items-center justify-center bg-red-950/50 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl text-yellow-500 font-bold font-display">
                福
              </div>
            </div>
            <div className="mt-2 text-[8px] sm:text-[10px] text-yellow-500/60 font-bold uppercase tracking-[0.2em]">
              Zodiac Edition
            </div>
          </div>
          {/* Decorative corners */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-yellow-500/40" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-yellow-500/40" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-yellow-500/40" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-yellow-500/40" />
        </div>
      )}
    </motion.div>
  );
};
