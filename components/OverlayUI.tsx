"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Calendar, Clock, Users, Utensils, CheckCircle, Star, Flame, ChefHat } from "lucide-react";

interface OverlayUIProps {
  activeSection: "genesis" | "searing" | "complete" | "none";
}

// Shared stagger container config
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const }
  },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: "easeOut" as const }
  },
};

export default function OverlayUI({ activeSection }: OverlayUIProps) {
  const [reservation, setReservation] = useState({
    name: "",
    guests: "2",
    date: "",
    time: "20:00",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation.name || !reservation.date) return;
    setIsSubmitted(true);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden font-sans">
      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════════════ */}
        {/* Milestone 1: Genesis of Flavor (0% - 22%)      */}
        {/* ═══════════════════════════════════════════════ */}
        {activeSection === "genesis" && (
          <motion.div
            key="genesis"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 flex flex-col justify-center px-6 md:px-24 max-w-4xl"
          >
            <div className="space-y-5">
              {/* Act label with decorative line */}
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-gradient-to-r from-gold to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
                  Act I — The Foundation
                </span>
              </motion.div>

              {/* Big heading */}
              <motion.h2 
                variants={fadeUp}
                className="font-serif text-5xl md:text-7xl font-light tracking-wide leading-[1.1]"
              >
                The Genesis <br />
                <span className="italic font-normal text-gold">of Flavor</span>
              </motion.h2>

              {/* Info card */}
              <motion.div 
                variants={fadeUpSlow}
                className="glass-panel glass-panel-hover p-6 rounded-2xl max-w-md pointer-events-auto"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-luxury-black font-medium mb-1.5">
                      01 / <span className="text-gold">The Toasted Brioche</span>
                    </h3>
                    <p className="text-[13px] text-warm-gray leading-relaxed font-light">
                      A delicate, double-fermented brioche bun, hand-glazed with organic butter and sprinkled with wild, toasted sesame seeds. Baked fresh every sunrise at 180°C.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* Milestone 2: Flame-Grilled (38% - 62%)         */}
        {/* ═══════════════════════════════════════════════ */}
        {activeSection === "searing" && (
          <motion.div
            key="searing"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 flex flex-col justify-center px-6 md:px-24 max-w-4xl"
          >
            <div className="space-y-5">
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-gradient-to-r from-gold to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
                  Act II — The Sizzle
                </span>
              </motion.div>

              <motion.h2 
                variants={fadeUp}
                className="font-serif text-5xl md:text-7xl font-light tracking-wide leading-[1.1]"
              >
                Flame-Grilled <br />
                <span className="italic font-normal text-gold">Perfection</span>
              </motion.h2>

              <motion.div 
                variants={fadeUpSlow}
                className="glass-panel glass-panel-hover p-6 rounded-2xl max-w-md pointer-events-auto"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-luxury-black font-medium mb-1.5">
                      02 / <span className="text-gold">Wagyu & Cheddar</span>
                    </h3>
                    <p className="text-[13px] text-warm-gray leading-relaxed font-light">
                      A high-marbling dry-aged A5 wagyu patty, double-seared on lava stones at 450°C. Finished with bubbling, melted raw milk cheddar aged for 24 months.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* Milestone 3: Masterpiece (83% - 100%)          */}
        {/* ═══════════════════════════════════════════════ */}
        {activeSection === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col lg:flex-row items-center justify-end px-6 md:px-16 lg:px-24 py-12 lg:py-0 overflow-y-auto lg:overflow-hidden"
          >
            {/* Subtle right-side gradient backdrop for panels */}
            <div className="absolute inset-0 bg-gradient-to-l from-cream/95 via-cream/60 to-transparent pointer-events-none" />

            {/* Left side text */}
            <div className="absolute left-6 md:left-24 bottom-12 lg:bottom-auto lg:top-1/4 max-w-sm pointer-events-none hidden md:block lg:max-w-md z-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="w-8 h-[1px] bg-gradient-to-r from-gold to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
                  Act III — Finale
                </span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-4xl lg:text-6xl font-light tracking-wide text-luxury-black"
              >
                The Masterpiece <br />
                <span className="italic font-normal text-gold">Is Complete</span>
              </motion.h2>
            </div>

            {/* Right side Menu & Reservation panels */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 50, damping: 14 }}
              className="w-full lg:w-[480px] space-y-5 pointer-events-auto z-30 lg:my-auto relative"
            >
              {/* ─── Menu Card ─── */}
              <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
                {/* Decorative gold accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center">
                    <ChefHat className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-light tracking-wide">
                    Signature Atelier <span className="text-gold italic font-normal">Menu</span>
                  </h3>
                </div>
                
                <div className="space-y-0">
                  {/* Menu Item 1 */}
                  <div className="flex justify-between items-start py-3.5">
                    <div className="pr-4">
                      <h4 className="font-serif text-[15px] text-luxury-black font-medium">L&apos;Or Classique</h4>
                      <p className="text-[11px] text-warm-gray/80 font-light mt-0.5 leading-relaxed">
                        Dry-aged Wagyu, black winter truffle aioli, 24k gold leaf.
                      </p>
                    </div>
                    <span className="font-serif text-gold text-base font-medium whitespace-nowrap">$48</span>
                  </div>
                  <div className="menu-divider" />

                  {/* Menu Item 2 */}
                  <div className="flex justify-between items-start py-3.5">
                    <div className="pr-4">
                      <h4 className="font-serif text-[15px] text-luxury-black font-medium">Le Sizzle d&apos;Ambre</h4>
                      <p className="text-[11px] text-warm-gray/80 font-light mt-0.5 leading-relaxed">
                        Aged cheddar, candied Iberico pancetta, oak-smoked relish.
                      </p>
                    </div>
                    <span className="font-serif text-gold text-base font-medium whitespace-nowrap">$38</span>
                  </div>
                  <div className="menu-divider" />

                  {/* Menu Item 3 */}
                  <div className="flex justify-between items-start py-3.5">
                    <div className="pr-4">
                      <h4 className="font-serif text-[15px] text-luxury-black font-medium">Pommes Frites Royale</h4>
                      <p className="text-[11px] text-warm-gray/80 font-light mt-0.5 leading-relaxed">
                        Triple-cooked duck fat fries, Parmigiano Reggiano, white truffle.
                      </p>
                    </div>
                    <span className="font-serif text-gold text-base font-medium whitespace-nowrap">$18</span>
                  </div>
                </div>
              </div>

              {/* ─── Reservation Card ─── */}
              <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center">
                    <Utensils className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-light tracking-wide">
                    Reserve Chef&apos;s Table
                  </h3>
                </div>

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form 
                      key="form"
                      onSubmit={handleSubmit} 
                      className="space-y-3.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-[0.15em] text-warm-gray font-medium">
                          Guest Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Jean-Luc Picard"
                          value={reservation.name}
                          onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
                          className="form-input w-full"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-[0.15em] text-warm-gray font-medium flex items-center gap-1">
                            <Users className="w-2.5 h-2.5" /> Guests
                          </label>
                          <select
                            value={reservation.guests}
                            onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
                            className="form-input w-full cursor-pointer"
                          >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="6">6 Guests</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-[0.15em] text-warm-gray font-medium flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" /> Date
                          </label>
                          <input
                            type="date"
                            required
                            value={reservation.date}
                            onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                            className="form-input w-full"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase tracking-[0.15em] text-warm-gray font-medium flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Time
                          </label>
                          <select
                            value={reservation.time}
                            onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                            className="form-input w-full cursor-pointer"
                          >
                            <option value="18:00">18:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="21:30">21:30</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-gold w-full mt-3 font-serif text-sm font-medium py-3 px-4 rounded-xl cursor-pointer tracking-wide"
                      >
                        Request Atelier Table
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      className="text-center py-8 space-y-4"
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    >
                      <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
                        <CheckCircle className="w-7 h-7 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-light text-luxury-black">Experience Confirmed</h4>
                        <p className="text-[11px] text-warm-gray mt-1.5 max-w-[280px] mx-auto leading-relaxed">
                          Salutations, <span className="text-gold font-medium">{reservation.name}</span>. 
                          A reservation for {reservation.guests} guests is held for {reservation.date} at {reservation.time}.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-[10px] text-gold hover:underline uppercase tracking-[0.2em] pt-1 cursor-pointer font-medium"
                      >
                        Modify Booking
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
