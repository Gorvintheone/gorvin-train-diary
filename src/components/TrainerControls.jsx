import React from "react";

export default function TrainerControls({
  clients,
  selectedClient,
  setSelectedClient,
  generateInvite,
  generatedCode,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
      <div>
        <label className="text-xs font-bold text-zinc-300 block mb-1">
          Kliens Kiválasztása:
        </label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-zinc-300 block mb-1">
          Új Kliens Meghívása:
        </label>
        <div className="flex gap-2">
          <button
            onClick={generateInvite}
            className="bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 text-xs px-3 py-2.5 rounded-lg font-semibold border border-purple-500/30 transition"
          >
            + Kód Generálása
          </button>
          {generatedCode && (
            <div className="bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-lg text-center flex-1">
              <span className="text-[10px] text-zinc-400 block">Kód:</span>
              <span className="text-sm font-mono font-bold text-purple-400 select-all">
                {generatedCode}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
