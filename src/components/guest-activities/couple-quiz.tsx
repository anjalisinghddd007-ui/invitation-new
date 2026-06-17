'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, Check, X } from 'lucide-react';

interface Question {
  id: number;
  q: string;
  options: string[];
  correct: number;
  funFact: string;
}

export default function CoupleQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      q: "Who initiated the very first conversation?",
      options: ["Anoop", "Sanya", "It was completely mutual", "A book falling off a shelf"],
      correct: 3, // book falling
      funFact: "Sanya was reaching for a poetry book on a high shelf in a bookstore. Anoop noticed, helped her get it, and that triggered their first conversation!"
    },
    {
      id: 2,
      q: "Where was their first official coffee date?",
      options: ["Café By The River", "The Library Cafe", "Brewed Awakenings", "Starbucks"],
      correct: 1,
      funFact: "They went to The Library Cafe and ended up talking for four hours straight until the cafe had to close!"
    },
    {
      id: 3,
      q: "What is Anoop's absolute favorite food that Sanya makes?",
      options: ["Paneer Tikka", "Homemade Pizza", "Cardamom Chai & Samosas", "Chocolate Brownies"],
      correct: 2,
      funFact: "Anoop is obsessed with Sanya's special hand-brewed ginger-cardamom chai paired with crispy hot samosas."
    },
    {
      id: 4,
      q: "Who is more likely to fall asleep during a movie night?",
      options: ["Anoop", "Sanya", "Both within 10 minutes", "Neither, they love movies"],
      correct: 1,
      funFact: "Sanya is notorious for selecting the movie and falling fast asleep within the first 15 minutes, leaving Anoop to watch it alone."
    },
    {
      id: 5,
      q: "What is their favorite shared hobby?",
      options: ["Hiking in the mountains", "Cooking experimental dinners", "Playing board games", "Stargazing on road trips"],
      correct: 3,
      funFact: "Whenever they drive, they love finding dark-sky spots to park, look at the stars, and talk about space and life."
    },
    {
      id: 6,
      q: "Who proposed, and where?",
      options: ["Sanya in a park", "Anoop on a decorated rooftop", "Joint proposal on a flight", "Anoop at the bookstore"],
      correct: 1,
      funFact: "Anoop proposed on a private rooftop overlooking the Yamuna river in Prayagraj, complete with fairy lights and roses."
    },
    {
      id: 7,
      q: "What was the color theme of their official Roka ceremony?",
      options: ["Royal Maroon & Gold", "Bright Orange & Yellow", "Pastel Sage Green & Ivory", "Dusty Pink & Lavender"],
      correct: 2,
      funFact: "They wore matching pastel sage green and ivory white outfits to keep the look modern, elegant, and light."
    },
    {
      id: 8,
      q: "Which coding language does Anoop claim is 'better than English'?",
      options: ["Python", "TypeScript", "C++", "Rust"],
      correct: 1,
      funFact: "As a senior software engineer, Anoop uses TypeScript for everything, but Sanya (who writes Python) calls it too verbose!"
    },
    {
      id: 9,
      q: "How many guests are they planning to host at the wedding?",
      options: ["Under 50 (Microwedding)", "Around 150-250 close friends", "Over 500 family members", "An entire village!"],
      correct: 1,
      funFact: "To keep things warm and intimate, they decided on a boutique guest list of about 200 close friends and family."
    },
    {
      id: 10,
      q: "Where are they planning to go for their honeymoon?",
      options: ["Maldives", "Switzerland Alps", "Japan Cherry Blossom tour", "Kerala Backwaters"],
      correct: 2,
      funFact: "They both love sushi and anime, so they are planning a magical 2-week spring honeymoon tour in Japan!"
    }
  ];

  const handleSelectOption = (idx: number) => {
    if (selectedOpt !== null) return; // already answered
    setSelectedOpt(idx);
    const isCorrect = idx === questions[currentIdx].correct;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setShowFact(true);
  };

  const handleNext = () => {
    setShowFact(false);
    setSelectedOpt(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setQuizFinished(false);
    setShowFact(false);
  };

  const getScoreRating = () => {
    if (score <= 3) return { title: "Acquaintance!", desc: "You might want to read their Love Story section again!" };
    if (score <= 7) return { title: "Good Friend!", desc: "You know them well, but there are still some fun secrets to learn!" };
    return { title: "Soulmate Companion!", desc: "Wow! You know Anoop & Sanya like the back of your hand. You are definitely in the inner circle!" };
  };

  const curQ = questions[currentIdx];

  return (
    <div className="w-full max-w-lg bg-[#FAF8F3]/80 border border-[#C5A880]/30 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(197,168,128,0.08)] flex flex-col justify-between min-h-[420px]">
      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1"
          >
            {/* Quiz Header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold">
                Couple Trivia Quiz
              </span>
              <span className="text-[11px] font-mono font-semibold text-zinc-500 bg-white/70 py-1 px-3 border border-zinc-200/55 rounded-full">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="font-serif text-lg md:text-xl text-zinc-800 leading-snug mb-6">
              {curQ.q}
            </h3>

            {/* Options List */}
            <div className="flex flex-col gap-3 flex-1 justify-center">
              {curQ.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === curQ.correct;
                const answered = selectedOpt !== null;

                let optClass = "border-zinc-200 hover:border-[#C5A880]/40 bg-white/50";
                if (answered) {
                  if (isCorrect) {
                    optClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
                  } else if (isSelected) {
                    optClass = "border-rose-500 bg-rose-50 text-rose-800";
                  } else {
                    optClass = "border-zinc-200/50 bg-zinc-50/20 text-zinc-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={answered}
                    className={`w-full flex items-center justify-between border rounded-xl p-3.5 text-left text-xs md:text-sm font-medium transition-all duration-300
                      ${optClass}
                      ${!answered ? 'hover:bg-white active:scale-[0.99] interactive' : ''}
                    `}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    {answered && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Fun Fact Display */}
            <AnimatePresence>
              {showFact && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 bg-[#FAF8F3] border border-dashed border-[#C5A880]/40 rounded-xl p-3.5 flex items-start gap-2.5 overflow-hidden"
                >
                  <Sparkles className="w-4 h-4 text-[#C5A880] fill-current flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A27B5C] block mb-0.5">Fun Fact</span>
                    <p className="text-[11px] md:text-xs text-zinc-600 leading-relaxed font-sans">
                      {curQ.funFact}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            {selectedOpt !== null && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="mt-6 w-full bg-[#C5A880] text-white text-[11px] font-semibold tracking-widest uppercase py-3 rounded-xl hover:bg-[#A27B5C] transition-colors interactive"
              >
                {currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}
              </motion.button>
            )}
          </motion.div>
        ) : (
          // Quiz Results Screen
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 flex flex-col items-center justify-between flex-1"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7 text-[#C5A880] fill-current" />
              </div>

              <span className="text-[11px] font-mono tracking-widest uppercase text-[#C5A880] font-bold block mb-1">
                Quiz Completed
              </span>
              <h3 className="font-serif text-3xl text-zinc-800 uppercase mb-3">
                Score: {score} / {questions.length}
              </h3>
              
              <div className="bg-[#FAF8F3] border border-[#C5A880]/20 rounded-2xl p-4 max-w-sm mb-6 mt-2">
                <span className="font-serif italic text-base text-[#A27B5C] block mb-1">
                  {getScoreRating().title}
                </span>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                  {getScoreRating().desc}
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full border border-zinc-300 text-zinc-600 text-xs tracking-wider uppercase font-semibold hover:border-[#C5A880] hover:text-[#A27B5C] transition-all duration-300 flex items-center gap-2 interactive"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
