'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Send, Users, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RsvpForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    events: [] as string[],
    foodPreference: 'Vegetarian'
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const availableEvents = [
    { id: 'haldi', label: 'Haldi Ceremony (19 Nov)' },
    { id: 'wedding', label: 'Wedding Ceremony (20 Nov)' }
  ];

  const handleCheckboxChange = (eventId: string) => {
    setForm(prev => {
      const exists = prev.events.includes(eventId);
      if (exists) {
        return { ...prev, events: prev.events.filter(e => e !== eventId) };
      } else {
        return { ...prev, events: [...prev.events, eventId] };
      }
    });
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email address.';
    if (!form.phone.trim()) return 'Please enter your phone number.';
    if (form.events.length === 0) return 'Please select at least one ceremony to attend.';
    return '';
  };

  const triggerPetalConfetti = () => {
    // Custom romantic petal-colored confetti
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    // Soft pink, ivory, champagne gold, dusty rose colors
    const colors = ['#EAD6D0', '#FAF8F3', '#D6C3A5', '#C8D1C3'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit RSVP. Please try again.');
      }

      setSubmitted(true);
      triggerPetalConfetti();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="py-28 px-6 bg-[#F3EEE7]/30 border-y border-[#C5A880]/15 w-full flex justify-center items-center">
      <div className="w-full max-w-xl bg-white border border-[#C5A880]/20 rounded-3xl p-8 md:p-12 shadow-[0_12px_45px_rgba(197,168,128,0.1)] relative overflow-hidden">
        
        {/* Decorative corner patterns */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#EAD6D0]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#C5A880]/5 rounded-full blur-2xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <span className="font-serif italic text-lg text-[#A27B5C] tracking-wide block mb-1">
                  Be Our Guest
                </span>
                <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-[4px] text-[#C5A880]">
                  RSVP Portal
                </h2>
                <div className="w-12 h-[1px] bg-[#C5A880]/40 mx-auto mt-3" />
                <p className="text-xs text-zinc-500 font-sans tracking-wide mt-2">
                  Please respond by October 25, 2026.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left font-sans">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#A27B5C]">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className="px-4 py-3 rounded-xl border border-[#C5A880]/30 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none text-zinc-700 placeholder:text-zinc-400 bg-[#FAF8F3]/50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#A27B5C]">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="px-4 py-3 rounded-xl border border-[#C5A880]/30 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none text-zinc-700 placeholder:text-zinc-400 bg-[#FAF8F3]/50 text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#A27B5C]">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="px-4 py-3 rounded-xl border border-[#C5A880]/30 focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none text-zinc-700 placeholder:text-zinc-400 bg-[#FAF8F3]/50 text-sm"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#A27B5C] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Number of Guests
                  </label>
                  <select
                    value={form.guests}
                    onChange={e => setForm({ ...form, guests: parseInt(e.target.value) })}
                    className="px-4 py-3 rounded-xl border border-[#C5A880]/30 focus:border-[#C5A880] outline-none text-zinc-700 bg-[#FAF8F3]/50 text-sm cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                {/* Events Attend checkbox */}
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#A27B5C]">Ceremonies Attending</label>
                  <div className="flex flex-col gap-2.5">
                    {availableEvents.map(ev => {
                      const checked = form.events.includes(ev.id);
                      return (
                        <label 
                          key={ev.id} 
                          className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer select-none transition-colors
                            ${checked ? 'border-[#C5A880] bg-[#FAF8F3]' : 'border-zinc-200 hover:border-[#C5A880]/30'}
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleCheckboxChange(ev.id)}
                            className="hidden"
                          />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                            ${checked ? 'bg-[#C5A880] border-[#C5A880] text-white' : 'border-zinc-300'}
                          `}>
                            {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm text-zinc-700 font-medium">{ev.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-medium text-rose-500 bg-rose-50 border border-rose-100 rounded-lg p-3 text-center"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-[#C5A880] text-white text-xs font-semibold tracking-[3px] uppercase py-3.5 rounded-xl hover:bg-[#A27B5C] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-zinc-400 interactive"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit RSVP
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            // Success State Screen
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-center py-10 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-[#C5A880] fill-current animate-pulse" />
              </div>
              
              <span className="font-serif italic text-xl text-[#A27B5C] block mb-2">
                Thank you for being part of our story!
              </span>
              <h3 className="font-serif text-2xl uppercase tracking-[3px] text-[#C5A880] mb-4">
                RSVP Registered
              </h3>
              
              <p className="text-xs md:text-sm text-zinc-500 leading-relaxed max-w-sm mb-8 font-sans">
                A confirmation has been logged. We cannot wait to celebrate our love and new beginnings with you in Prayagraj.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="text-zinc-500 border-b border-zinc-400 pb-0.5 text-[11px] tracking-widest uppercase hover:text-[#C5A880] hover:border-[#C5A880] transition-colors interactive font-medium"
              >
                Modify Response
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
