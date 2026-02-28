import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { isNonWorking, addDays, calcBlock, analyzeRange, formatFull } from "../../utils/holiday";
import { DayStepper, QuickDayPicker, DayStrip } from "../ui/SharedUI";

export default function CalcTab() {
  const [startInput, setStartInput] = useState("2026-01-05");
  const [leaveDays, setLeaveDays] = useState(5);

  const result = useMemo(() => {
    if (!startInput || leaveDays < 1) return null;
    let start = new Date(startInput + "T00:00:00");
    while (isNonWorking(start)) start = addDays(start, 1);
    const block = calcBlock(start, leaveDays);
    const days = analyzeRange(block.blockStart, block.blockEnd);
    const weekendCount = days.filter(d => d.weekend && !d.holiday).length;
    const holidayCount = days.filter(d => d.holiday).length;
    const leaveCount = days.filter(d => !d.isNonWorking).length;
    return { ...block, days, weekendCount, holidayCount, leaveCount };
  }, [startInput, leaveDays]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-lg space-y-5 overflow-hidden">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">휴가 시작일</label>
          <input 
            type="date" 
            value={startInput} 
            min="2026-01-01" 
            max="2026-12-31"
            onChange={e => setStartInput(e.target.value)} 
            className="w-[90%] min-w-0 h-12 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all [color-scheme:dark] box-border" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">연차 사용일수</label>
          <DayStepper value={leaveDays} onChange={setLeaveDays} max={30} />
          <QuickDayPicker value={leaveDays} onChange={setLeaveDays} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div 
            key={result.blockStart.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="mt-4"
          >
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex items-center gap-2 mb-4 text-yellow-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold tracking-widest uppercase">Result</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
                {[
                  { label: "연속 휴일", value: result.totalDays, color: "text-yellow-400", bg: "bg-yellow-400/10 border border-yellow-400/20" },
                  { label: "주말 포함", value: result.weekendCount, color: "text-zinc-300", bg: "bg-zinc-900 border border-zinc-800" },
                  { label: "공휴일 포함", value: result.holidayCount, color: "text-zinc-300", bg: "bg-zinc-900 border border-zinc-800" },
                ].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    key={item.label} 
                    className={`${item.bg} rounded-xl p-3 text-center`}
                  >
                    <div className={`text-2xl font-black ${item.color} leading-none mb-1`}>
                      {item.value}<span className="text-xs font-medium ml-0.5 opacity-70">일</span>
                    </div>
                    <div className="text-[10px] font-medium text-zinc-400">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-800 relative z-10">
                {[
                  { label: "휴가 시작", value: formatFull(result.blockStart) },
                  { label: "휴가 마지막", value: formatFull(result.blockEnd) },
                  { label: "연차 사용", value: `${result.leaveCount}일`, valueClass: "text-emerald-400 font-bold" },
                  { label: "덤으로 쉬는 날", value: `+${result.bonus}일 (주말·공휴일)`, valueClass: "text-yellow-400 font-bold" },
                ].map((r, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    key={r.label} 
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-zinc-400">{r.label}</span>
                    <span className={r.valueClass || "text-white font-medium"}>{r.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-5 mt-4 border border-zinc-800 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-3">일별 현황</h3>
              <DayStrip days={result.days} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
