import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarDays, Sparkles, ArrowRight } from "lucide-react";
import CalcTab from "./components/tabs/CalcTab";
import OptimizerTab from "./components/tabs/OptimizerTab";

export default function App() {
  const [tab, setTab] = useState("optimizer");

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid-pattern text-zinc-100 font-sans selection:bg-yellow-400/30 selection:text-yellow-200 pb-20">
      
      <main className="max-w-md mx-auto px-5 pt-10 overflow-hidden">
        
        {/* Hero Section */}
        <div className="mb-8 pt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
            <span className="text-zinc-400 text-xs font-bold tracking-wider">2026 휴가 계산기</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.15] tracking-tight mb-6 break-keep">
            내 연차,<br/>
            언제 쓰는 게<br/>
            제일 이득?
          </h1>
          <ul className="space-y-2.5 text-zinc-300 font-medium text-xs sm:text-sm">
            <li className="flex items-start gap-2.5">
              <ArrowRight className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5"/> 
              <span className="break-keep">연차 1~20일 모든 케이스 자동 계산</span>
            </li>
            <li className="flex items-start gap-2.5">
              <ArrowRight className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5"/> 
              <span className="break-keep">2026 대체공휴일 완전 반영</span>
            </li>
            <li className="flex items-start gap-2.5">
              <ArrowRight className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5"/> 
              <span className="break-keep">최적 일정 Top 5 자동 추천</span>
            </li>
            <li className="flex items-start gap-2.5">
              <ArrowRight className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5"/> 
              <span className="break-keep">날짜별 상세 분석 & 효율 점수</span>
            </li>
          </ul>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800 mb-8 shadow-xl">
          {[
            { id: "optimizer", label: "최적 일정 찾기", icon: Sparkles },
            { id: "calc", label: "직접 계산하기", icon: CalendarDays },
          ].map(t => {
            const isActive = tab === t.id;
            const Icon = t.icon;
            return (
              <button 
                key={t.id} 
                onClick={() => setTab(t.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-colors z-0 ${
                  isActive ? "text-yellow-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : ''}`} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === "calc" ? <CalcTab key="calc" /> : <OptimizerTab key="optimizer" />}
        </AnimatePresence>

      </main>
    </div>
  );
}
