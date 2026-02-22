import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS, SUITS } from '../constants';
import { cn } from '../utils/cn';

interface SuitPickerProps {
  onSelect: (suit: Suit) => void;
}

export const SuitPicker: React.FC<SuitPickerProps> = ({ onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-2xl font-display font-bold text-center mb-6 text-white">
          Pick a Suit
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {SUITS.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={cn(
                'flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors group',
                SUIT_COLORS[suit]
              )}
            >
              <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                {SUIT_SYMBOLS[suit]}
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                {suit}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
