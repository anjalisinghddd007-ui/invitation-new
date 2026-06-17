'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Sparkles } from 'lucide-react';

interface Wish {
  id: string;
  name: string;
  text: string;
  color: string;
  timestamp: string;
}

export default function BlessingWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [form, setForm] = useState({ name: '', text: '', color: '#FAF8F3' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const colors = [
    { value: '#FAF8F3', label: 'Ivory' },
    { value: '#EAD6D0', label: 'Rose' },
    { value: '#C8D1C3', label: 'Sage' },
    { value: '#D6C3A5', label: 'Gold' }
  ];

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      if (res.ok) {
        const data = await res.json();
        setWishes(data.wishes || []);
      }
    } catch (e) {
      console.error('Error fetching wishes:', e);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.text.trim()) return setError('Please write a blessing.');

    setLoading(true);

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Submission failed.');
      }

      setForm({ name: '', text: '', color: '#FAF8F3' });
      fetchWishes(); // Refresh feed
    } catch (err: any) {
      setError(err.message || 'Could not submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-[#C5A880]/20 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(197,168,128,0.05)] flex flex-col md:flex-row gap-8 min-h-[460px]">
      
      {/* LEFT: Submit Blessing Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Heart className="w-4 h-4 text-[#C5A880] fill-current animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] font-bold">
              Blessing Wall
            </span>
          </div>
          <h3 className="font-serif text-xl text-zinc-800 uppercase mb-4 text-left">
            Leave Your Wishes
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed text-left mb-6 font-sans">
            Write a message of love, support, or marriage blessings. It will appear on our digital wall and grow on our memory tree.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-sans">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-[#C5A880] outline-none text-zinc-700 placeholder:text-zinc-400 bg-[#FAF8F3]/40 text-xs"
              />
            </div>

            {/* Wish Text */}
            <div className="flex flex-col gap-1">
              <textarea
                placeholder="Write your blessing here..."
                rows={3}
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                className="px-3 py-2.5 rounded-xl border border-zinc-200 focus:border-[#C5A880] outline-none text-zinc-700 placeholder:text-zinc-400 bg-[#FAF8F3]/40 text-xs resize-none"
              />
            </div>

            {/* Color Chooser */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A27B5C]">Card Accent</span>
              <div className="flex gap-2">
                {colors.map(col => (
                  <button
                    key={col.value}
                    type="button"
                    onClick={() => setForm({ ...form, color: col.value })}
                    className={`w-5 h-5 rounded-full border transition-all duration-300
                      ${form.color === col.value ? 'scale-125 border-zinc-700 shadow-md' : 'border-zinc-300'}
                    `}
                    style={{ backgroundColor: col.value }}
                    title={col.label}
                  />
                ))}
              </div>
            </div>

            {error && (
              <span className="text-[10px] font-medium text-rose-500 text-center">
                {error}
              </span>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C5A880] text-white text-[10px] font-semibold tracking-widest uppercase py-3 rounded-xl hover:bg-[#A27B5C] transition-all flex items-center justify-center gap-1.5 disabled:bg-zinc-400 interactive"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  Post Wish
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: Live Wishes Feed scrolling list */}
      <div className="w-full md:w-1/2 flex flex-col max-h-[380px] overflow-hidden border-t md:border-t-0 md:border-l border-[#C5A880]/15 pt-6 md:pt-0 md:pl-6">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#A27B5C] font-semibold mb-3 text-left">
          Blessings Feed ({wishes.length})
        </span>

        <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-3 pr-1">
          <AnimatePresence initial={false}>
            {wishes.slice().reverse().map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-[#C5A880]/20 p-4 shadow-sm text-left flex flex-col justify-between min-h-[90px]"
                style={{ backgroundColor: wish.color }}
              >
                <p className="font-serif italic text-xs text-zinc-700 leading-relaxed mb-3">
                  "{wish.text}"
                </p>
                <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-[#A27B5C] uppercase border-t border-[#C5A880]/10 pt-2 font-semibold">
                  <span>- {wish.name}</span>
                  <span className="text-zinc-400">
                    {new Date(wish.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {wishes.length === 0 && (
            <div className="h-full flex items-center justify-center text-zinc-400 text-xs italic py-12">
              No blessings posted yet. Be the first!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
