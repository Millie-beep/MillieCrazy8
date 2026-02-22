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

  // 使用与用户提供图片风格一致的星空/星云图片
  const backImageUrl = `https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=400&q=80`;

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        'relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl shadow-2xl transition-all duration-300 cursor-default select-none overflow-hidden',
        isFaceUp ? 'bg-white' : 'bg-indigo-950 border-2 border-white/20',
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
        <div className="w-full h-full relative bg-indigo-950">
          <img 
            src={backImageUrl} 
            alt="Card Back" 
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          {/* 柔和的渐变叠加，增加层次感 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20" />
          
          {/* 装饰性边框 */}
          <div className="absolute inset-2 border border-white/10 rounded-lg" />
          
          {/* 中心装饰符号 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
