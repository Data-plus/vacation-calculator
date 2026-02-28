import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { findOptimal, analyzeRange, formatShort } from "../../utils/holiday";
import { DayStepper, QuickDayPicker, DayStrip } from "../ui/SharedUI";

export default function OptimizerTab() {
  const [leaveDays, setLeaveDays] = useState(3);
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleChange = (n: number) => { setLeaveDays(n); setExpanded(null); };
  const top5 = useMemo(() => findOptimal(leaveDays, 5), [leaveDays]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-lg mb-6">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">연차 사용일수</label>
        <DayStepper value={leaveDays} onChange={handleChange} />
        <QuickDayPicker value={leaveDays} onChange={handleChange} options={[1,2,3,4,5,7,10]} />
      </div>

      <p className="text-xs text-zinc-400 mb-3 text-center font-medium">
        연차 <strong className="text-yellow-400 text-sm">{leaveDays}일</strong>로 가장 오래 쉴 수 있는 Top 5
      </p>

      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08 } }
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {top5.map((item, idx) => {
          const isOpen = expanded === idx;
          const days = analyzeRange(item.blockStart, item.blockEnd);
          const holidayCount = days.filter(d => d.holiday).length;
          const weekendCount = days.filter(d => d.weekend && !d.holiday).length;

          return (
            <motion.div 
              layout
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              key={idx}
              className={`bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 border ${
                isOpen ? 'border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : 'border-zinc-800 shadow-sm'
              }`}
            >
              <motion.button 
                layout="position"
                onClick={() => setExpanded(isOpen ? null : idx)}
                className="w-full p-4 flex items-center gap-4 text-left bg-zinc-900 hover:bg-zinc-800/80 transition-colors"
              >
                {/* Medal Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  idx === 0 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' :
                  idx === 1 ? 'bg-zinc-700/50 text-zinc-300 border border-zinc-600' :
                  idx === 2 ? 'bg-amber-700/30 text-amber-500 border border-amber-700/50' :
                  'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}>
                  {idx === 0 ? <Trophy className="w-5 h-5" /> :
                   idx === 1 ? <Medal className="w-5 h-5" /> :
                   idx === 2 ? <Award className="w-5 h-5" /> :
                   <span className="font-bold text-sm">{idx + 1}위</span>}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-base mb-0.5 truncate">
                    {formatShort(item.blockStart)} ~ {formatShort(item.blockEnd)}
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-1.5 flex-wrap">
                    <span>연차 {item.usedLeave}일</span>
                    <span className="text-zinc-600">•</span>
                    <span className="font-semibold text-emerald-400">{item.totalDays}일 연속 휴식</span>
                    {holidayCount > 0 && (
                      <>
                        <span className="text-zinc-600">•</span>
                        <span className="text-rose-400">공휴일 {holidayCount}일</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Big Number */}
                <div className="text-right shrink-0">
                  <div className={`text-2xl font-black leading-none ${idx === 0 ? 'text-yellow-400' : 'text-white'}`}>
                    {item.totalDays}
                  </div>
                  <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">Days</div>
                </div>

                <motion.div 
                  animate={{ rotate: isOpen ? 180 : 0 }} 
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-zinc-500 shrink-0 ml-1"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-zinc-800 pt-4">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-2 mb-5">
                        {[
                          { label: "총 휴일", value: item.totalDays, color: "text-yellow-400", bg: "bg-yellow-400/10 border border-yellow-400/20" },
                          { label: "연차", value: item.usedLeave, color: "text-emerald-400", bg: "bg-emerald-500/10 border border-emerald-500/20" },
                          { label: "주말", value: weekendCount, color: "text-zinc-300", bg: "bg-zinc-800 border border-zinc-700" },
                          { label: "공휴일", value: holidayCount, color: "text-rose-400", bg: "bg-rose-500/10 border border-rose-500/20" },
                        ].map((s, i) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={s.label} 
                            className={`${s.bg} rounded-xl p-2 text-center`}
                          >
                            <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                            <div className="text-[10px] font-medium text-zinc-400 mt-0.5">{s.label}</div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Efficiency Bar */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-5 bg-zinc-950 rounded-xl p-3 border border-zinc-800"
                      >
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                            <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
                            휴가 효율
                          </div>
                          <div className="text-sm font-black text-white">
                            {(item.totalDays / item.usedLeave).toFixed(1)}<span className="text-xs font-medium text-zinc-500 ml-0.5">배</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (item.totalDays / item.usedLeave / 5) * 100)}%` }}
                            transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0 }}
                            className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                          />
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-1.5 text-right">
                          연차 1일당 {(item.totalDays / item.usedLeave).toFixed(1)}일 휴식
                        </div>
                      </motion.div>

                      <DayStrip days={days} compact />

                      {/* Holiday Tags */}
                      {holidayCount > 0 && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="mt-4 flex flex-wrap gap-1.5"
                        >
                          {days.filter(d => d.holiday).map((d, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                              {d.date.getMonth() + 1}/{d.date.getDate()} {d.holidayName}
                            </span>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
