import React, { useState } from "react";

export default function TrainerControls({
  clients,
  selectedClient,
  setSelectedClient,
  trainers,
  generateClientInvite,
  generatedClientCode,
  generateTrainerInvite,
  generatedTrainerCode,
  user,
}) {
  const [activeTab, setActiveTab] = useState("clients");

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-4">
      {/* Főadmin / Edző fülválasztó */}
      <div className="flex border-b border-zinc-800 pb-3 gap-4">
        <button
          onClick={() => setActiveTab("clients")}
          className={`text-xs font-bold pb-1 transition border-b-2 ${
            activeTab === "clients"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Kliensek & Kliens Kódok
        </button>
        {user.id === "trainer_1" && (
          <button
            onClick={() => setActiveTab("trainers")}
            className={`text-xs font-bold pb-1 transition border-b-2 ${
              activeTab === "trainers"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Főadmin: Edzői Kód Generálás ({trainers.length} Edző)
          </button>
        )}
      </div>

      {activeTab === "clients" ? (
        <div className="grid md:grid-cols-2 gap-4">
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
              Új Kliens Meghívó ({user.name}):
            </label>
            <div className="flex gap-2">
              <button
                onClick={generateClientInvite}
                className="bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 text-xs px-3 py-2.5 rounded-lg font-semibold border border-purple-500/30 transition"
              >
                + Kliens Kód Generálás
              </button>
              {generatedClientCode && (
                <div className="bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-lg text-center flex-1">
                  <span className="text-[10px] text-zinc-400 block">Kód:</span>
                  <span className="text-sm font-mono font-bold text-purple-400 select-all">
                    {generatedClientCode}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">
              Új Edző Regisztrációs Kód Generálása (Főadmin):
            </label>
            <div className="flex gap-2">
              <button
                onClick={generateTrainerInvite}
                className="bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs px-3 py-2.5 rounded-lg font-semibold border border-emerald-500/30 transition"
              >
                + Edzői Kód (EDZO-...)
              </button>
              {generatedTrainerCode && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-center flex-1">
                  <span className="text-[10px] text-zinc-400 block">Edző Kód:</span>
                  <span className="text-sm font-mono font-bold text-emerald-400 select-all">
                    {generatedTrainerCode}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-xs">
            <span className="font-bold text-zinc-400 block mb-1">Aktív Edzők a Rendszerben:</span>
            <ul className="space-y-1 text-zinc-300">
              {trainers.map((t) => (
                <li key={t.id} className="flex justify-between">
                  <span>{t.name}</span>
                  <span className="text-purple-400 font-mono text-[10px]">Prefix: {t.prefix}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
