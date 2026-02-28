import { motion } from "motion/react";
import { DAY_KR } from "../../utils/holiday";

export function QuickDayPicker({ value, onChange, options = [1, 2, 3, 4, 5, 7, 10] }: { value: number, onChange: (n: number) => void, options?: number[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map(n => (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          key={n} 
          onClick={() => onChange(n)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            value === n 
              ? "bg-yellow-400 text-zinc-950 shadow-[0_0_10px_rgba(250,204,21,0.3)]" 
              : "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          {n}일
        </motion.button>
      ))}
    </div>
  );
}

export function DayStepper({ value, onChange, min = 1, max = 30 }: { value: number, onChange: (n: number) => void, min?: number, max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-12 h-12 rounded-xl border border-zinc-700 bg-zinc-800 flex items-center justify-center text-xl text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >−</motion.button>
      <motion.div 
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex-1 h-12 rounded-xl border border-zinc-700 bg-zinc-900/50 flex items-center justify-center text-xl font-black text-yellow-400 shadow-inner"
      >
        {value}<span className="text-sm font-medium text-zinc-500 ml-1">일</span>
      </motion.div>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-12 h-12 rounded-xl border border-zinc-700 bg-zinc-800 flex items-center justify-center text-xl text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >+</motion.button>
    </div>
  );
}

export function DayStrip({ days, compact = false }: { days: any[], compact?: boolean }) {
  return (
    <div className="w-full">
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.03 } }
        }}
        className="flex overflow-x-auto pb-3 -mx-1 px-1 snap-x scrollbar-hide gap-1.5"
      >
        {days.map((d, i) => {
          let bg = "bg-emerald-500/10 border-emerald-500/20", col = "text-emerald-400", dot = "bg-emerald-400";
          if (d.holiday) { bg = "bg-rose-500/10 border-rose-500/20"; col = "text-rose-400"; dot = "bg-rose-400"; }
          else if (d.weekend) { bg = "bg-zinc-800/50 border-zinc-800"; col = "text-zinc-500"; dot = "bg-zinc-600"; }
          
          return (
            <motion.div 
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 10 },
                show: { opacity: 1, scale: 1, y: 0 }
              }}
              key={i} 
              title={d.holidayName || ""} 
              className={`snap-start shrink-0 flex flex-col items-center justify-center border rounded-xl ${bg} ${compact ? 'w-10 h-12' : 'w-12 h-14'}`}
            >
              <div className={`font-bold ${compact ? 'text-xs' : 'text-sm'} ${col}`}>
                {d.date.getDate()}
              </div>
              <div className={`text-[10px] font-medium opacity-80 ${col}`}>
                {DAY_KR[d.date.getDay()]}
              </div>
              <div className={`w-1 h-1 rounded-full mt-0.5 ${dot}`} />
            </motion.div>
          );
        })}
      </motion.div>
      <div className="flex flex-wrap gap-3 mt-1 text-xs text-zinc-400 font-medium">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-400" />연차</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-zinc-600" />주말</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-rose-400" />공휴일</div>
      </div>
    </div>
  );
}
