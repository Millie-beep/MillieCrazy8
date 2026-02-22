/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Info, ChevronRight, Layers } from 'lucide-react';
import { Card } from './components/Card';
import { SuitPicker } from './components/SuitPicker';
import { CardData, GameState, Suit } from './types';
import { createDeck, shuffle, SUIT_SYMBOLS, SUIT_COLORS } from './constants';
import { cn } from './utils/cn';

const INITIAL_HAND_SIZE = 8;

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentSuit: 'hearts',
    turn: 'player',
    status: 'dealing',
    winner: null,
  });

  const [message, setMessage] = useState<string>('Welcome to Crazy Eights!');

  const initGame = useCallback(() => {
    const fullDeck = shuffle(createDeck());
    const playerHand = fullDeck.splice(0, INITIAL_HAND_SIZE);
    const aiHand = fullDeck.splice(0, INITIAL_HAND_SIZE);
    const firstDiscard = fullDeck.pop()!;
    
    setGameState({
      deck: fullDeck,
      playerHand,
      aiHand,
      discardPile: [firstDiscard],
      currentSuit: firstDiscard.suit,
      turn: 'player',
      status: 'playing',
      winner: null,
    });
    setMessage("Your turn! Match the suit or rank.");
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const checkPlayable = (card: CardData) => {
    if (gameState.status !== 'playing' || gameState.turn !== 'player') return false;
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    
    // Crazy 8 is always playable
    if (card.rank === '8') return true;
    
    // Match rank or current suit
    return card.rank === topCard.rank || card.suit === gameState.currentSuit;
  };

  const handlePlayCard = (card: CardData, isPlayer: boolean) => {
    const newHand = isPlayer 
      ? gameState.playerHand.filter(c => c.id !== card.id)
      : gameState.aiHand.filter(c => c.id !== card.id);

    const nextTurn = isPlayer ? 'ai' : 'player';
    const newStatus = card.rank === '8' ? 'picking_suit' : 'playing';

    setGameState(prev => ({
      ...prev,
      [isPlayer ? 'playerHand' : 'aiHand']: newHand,
      discardPile: [...prev.discardPile, card],
      currentSuit: card.suit,
      turn: card.rank === '8' ? prev.turn : nextTurn,
      status: card.rank === '8' && isPlayer ? 'picking_suit' : 'playing',
      winner: newHand.length === 0 ? (isPlayer ? 'player' : 'ai') : null,
    }));

    if (newHand.length === 0) {
      setMessage(isPlayer ? "You Win! 🎉" : "AI Wins! 🤖");
      setGameState(prev => ({ ...prev, status: 'game_over' }));
      return;
    }

    if (card.rank === '8') {
      if (isPlayer) {
        setMessage("Crazy 8! Pick a new suit.");
      } else {
        // AI picks a suit (most frequent in its hand)
        const suits = gameState.aiHand.map(c => c.suit);
        const mostFrequentSuit = suits.sort((a,b) =>
          suits.filter(v => v===a).length - suits.filter(v => v===b).length
        ).pop() || 'hearts';
        
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            currentSuit: mostFrequentSuit as Suit,
            turn: 'player',
            status: 'playing'
          }));
          setMessage(`AI picked ${mostFrequentSuit}! Your turn.`);
        }, 1000);
      }
    } else {
      setMessage(isPlayer ? "AI is thinking..." : "Your turn!");
    }
  };

  const handleDrawCard = (isPlayer: boolean) => {
    if (gameState.deck.length === 0) {
      setMessage("Deck is empty! Skipping turn.");
      setGameState(prev => ({ ...prev, turn: isPlayer ? 'ai' : 'player' }));
      return;
    }

    const newDeck = [...gameState.deck];
    const drawnCard = newDeck.pop()!;
    const newHand = isPlayer 
      ? [...gameState.playerHand, drawnCard]
      : [...gameState.aiHand, drawnCard];

    setGameState(prev => ({
      ...prev,
      deck: newDeck,
      [isPlayer ? 'playerHand' : 'aiHand']: newHand,
      turn: isPlayer ? 'ai' : 'player'
    }));

    setMessage(isPlayer ? "You drew a card. AI's turn." : "AI drew a card. Your turn.");
  };

  // AI Logic
  useEffect(() => {
    if (gameState.turn === 'ai' && gameState.status === 'playing' && !gameState.winner) {
      const timer = setTimeout(() => {
        const playableCards = gameState.aiHand.filter(card => {
          const topCard = gameState.discardPile[gameState.discardPile.length - 1];
          return card.rank === '8' || card.rank === topCard.rank || card.suit === gameState.currentSuit;
        });

        if (playableCards.length > 0) {
          // AI plays the first playable card (could be smarter)
          const cardToPlay = playableCards[0];
          handlePlayCard(cardToPlay, false);
        } else {
          handleDrawCard(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.turn, gameState.status, gameState.aiHand, gameState.discardPile, gameState.currentSuit]);

  const handleSuitSelect = (suit: Suit) => {
    setGameState(prev => ({
      ...prev,
      currentSuit: suit,
      turn: 'ai',
      status: 'playing'
    }));
    setMessage(`You picked ${suit}. AI's turn.`);
  };

  const topDiscard = gameState.discardPile[gameState.discardPile.length - 1];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 overflow-hidden select-none">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-white/5 bg-zinc-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight">Millie's Crazy 8s</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Status</span>
            <span className="text-sm font-medium text-emerald-400">{message}</span>
          </div>
          <button 
            onClick={initGame}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 relative flex flex-col p-4 sm:p-8 gap-8 overflow-hidden">
        {/* AI Hand */}
        <div className="flex justify-center h-24 sm:h-32">
          <div className="flex -space-x-12 sm:-space-x-16 hover:-space-x-8 transition-all duration-300">
            {gameState.aiHand.map((card, i) => (
              <Card 
                key={card.id} 
                card={card} 
                isFaceUp={false} 
                index={i}
                className="scale-75 sm:scale-90 origin-top"
              />
            ))}
          </div>
        </div>

        {/* Center Area (Deck & Discard) */}
        <div className="flex-1 flex items-center justify-center gap-8 sm:gap-16">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <button 
              onClick={() => gameState.turn === 'player' && handleDrawCard(true)}
              disabled={gameState.turn !== 'player' || gameState.status !== 'playing'}
              className="relative"
            >
              <Card 
                card={{} as any} 
                isFaceUp={false} 
                className={cn(
                  "shadow-2xl transform transition-transform",
                  gameState.turn === 'player' && "hover:scale-105 active:scale-95 cursor-pointer"
                )}
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                Draw Pile ({gameState.deck.length})
              </div>
            </button>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              {topDiscard && (
                <Card 
                  key={topDiscard.id}
                  card={topDiscard} 
                  className="shadow-2xl"
                />
              )}
            </AnimatePresence>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Current Suit:</span>
              <span className={cn("text-sm font-bold", SUIT_COLORS[gameState.currentSuit])}>
                {SUIT_SYMBOLS[gameState.currentSuit]} {gameState.currentSuit.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Player Hand */}
        <div className="flex justify-center h-48 sm:h-64">
          <div className="flex -space-x-12 sm:-space-x-16 hover:-space-x-4 transition-all duration-300 pb-8">
            {gameState.playerHand.map((card, i) => (
              <Card 
                key={card.id} 
                card={card} 
                isPlayable={checkPlayable(card)}
                onClick={() => handlePlayCard(card, true)}
                index={i}
                className="hover:z-10"
              />
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Message Bar */}
      <div className="sm:hidden p-4 bg-zinc-900 border-t border-white/5 text-center">
        <span className="text-sm font-medium text-emerald-400">{message}</span>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {gameState.status === 'picking_suit' && (
          <SuitPicker onSelect={handleSuitSelect} />
        )}

        {gameState.status === 'game_over' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl shadow-2xl max-w-md w-full text-center">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-yellow-500" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-2">
                {gameState.winner === 'player' ? 'Victory!' : 'Defeat'}
              </h2>
              <p className="text-zinc-400 mb-8">
                {gameState.winner === 'player' 
                  ? "You played like a pro! Ready for another round?" 
                  : "The AI outsmarted you this time. Try again?"}
              </p>
              <button
                onClick={initGame}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group"
              >
                <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
