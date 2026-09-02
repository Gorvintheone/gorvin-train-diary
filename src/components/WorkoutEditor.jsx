import React from "react";

export default function WorkoutEditor({
  selectedDate,
  todayStr,
  user,
  workoutInput,
  setWorkoutInput,
  saveWorkout,
  savedStatus,
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-zinc-100 text-base">
            {selectedDate === todayStr ? "Mai edzés" : `Edzésterv erre a napra:`}
          </h3>
          <p className="text-xs text-purple-400 font-mono">{selectedDate}</p>
        </div>
        {user.role === "trainer" && (
          <span className="text-xs text-zinc-500 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            Szerkesztési mód
          </span>
        )}
      </div>

      {user.role === "trainer" ? (
        <div className="space-y-4">
          <textarea
            rows="8"
            value={workoutInput}
            onChange={(e) => setWorkoutInput(e.target.value)}
            placeholder="Írd ide a nap edzéstervét..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 resize-none transition"
          />
          <button
            onClick={saveWorkout}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg text-xs transition shadow-lg shadow-purple-600/25"
          >
            Edzésterv Mentése Erre a Napra
          </button>
          {savedStatus && (
            <p className="text-xs text-emerald-400 text-center font-medium">
              ✓ Edzésterv sikeresen elmentve!
            </p>
          )}
        </div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl min-h-[180px] whitespace-pre-wrap text-xs text-zinc-200 leading-relaxed">
          {workoutInput || (
            <span className="text-zinc-600 italic">
              Erre a napra nincs kiírt edzésterv (Pihenőnap).
            </span>
          )}
        </div>
      )}
    </div>
  );
}
