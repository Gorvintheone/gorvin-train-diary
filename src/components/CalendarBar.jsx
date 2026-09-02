import React from "react";

export default function CalendarBar({ twoWeeks, workouts, activeClientId, selectedDate, setSelectedDate }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
      <h2 className="text-xs font-bold text-zinc-400 mb-3 tracking-wider uppercase">
        Következő 2 hét (Kattints egy napra)
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {twoWeeks.map((d) => {
          const hasWorkout = !!workouts[`${activeClientId}_${d.fullDate}`];
          const isSelected = selectedDate === d.fullDate;

          return (
            <button
              key={d.fullDate}
              onClick={() => setSelectedDate(d.fullDate)}
              className={`flex-shrink-0 w-16 p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30 scale-105"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <p className="text-[10px] font-medium uppercase opacity-75">{d.dayName}</p>
              <p className="text-base font-bold my-0.5">{d.dayNum}</p>
              <p className="text-[9px] opacity-60">{d.month}</p>

              <div className="mt-1 flex justify-center">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasWorkout ? (isSelected ? "bg-white" : "bg-purple-400") : "bg-transparent"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
