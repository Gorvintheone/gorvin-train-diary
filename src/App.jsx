import React, { useState, useEffect } from "react";
import { getWorkouts, getUsers } from "./services/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  // Autentikáció és űrlap állapotok
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Kliensek listája
  const [clients, setClients] = useState([
    { id: "1", name: "Minta Kliens Péter", email: "peter@test.com" },
  ]);
  const [selectedClient, setSelectedClient] = useState("1");

  // NAPTÁR ÉS EDZÉSTERVEK ÁLLAPOTA
  const [todayStr] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [workouts, setWorkouts] = useState({});

  const [workoutInput, setWorkoutInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [savedStatus, setSavedStatus] = useState(false);
  const [activeCodes, setActiveCodes] = useState(["GORVIN-DEMO12"]);

  // Backend adatok lekérése indításkor
  useEffect(() => {
    getWorkouts()
      .then((data) => {
        if (Array.isArray(data)) {
          // Ha a backend ad vissza edzéseket, itt leképezhetjük őket
          const mapped = {};
          data.forEach((w) => {
            const key = `${w.user_id || "1"}_${w.date || todayStr}`;
            mapped[key] = w.title || w.description || JSON.stringify(w);
          });
          setWorkouts((prev) => ({ ...prev, ...mapped }));
        }
      })
      .catch((err) => console.log("Backend offline vagy még üres:", err));
  }, [todayStr]);

  // Amikor megváltozik a kiválasztott kliens vagy dátum, betöltjük az adott napi tervet
  useEffect(() => {
    const activeClientId =
      user?.role === "client" ? String(user.id) : selectedClient;
    const key = `${activeClientId}_${selectedDate}`;
    setWorkoutInput(workouts[key] || "");
  }, [selectedClient, selectedDate, workouts, user]);

  // Következő 14 nap generálása a naptárválasztóhoz
  const getNextTwoWeeks = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split("T")[0],
        dayName: d.toLocaleDateString("hu-HU", { weekday: "short" }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString("hu-HU", { month: "short" }),
      });
    }
    return dates;
  };

  // Bejelentkezés
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Edző belépés (G / 123)
    if (email === "G" && password === "123") {
      const mockUser = {
        id: "trainer_1",
        name: "Gorvin WS (Edző)",
        email: "G",
        role: "trainer",
      };
      setToken("mock-trainer-token");
      setUser(mockUser);
      localStorage.setItem("token", "mock-trainer-token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      return;
    }

    // Kliens belépés
    const foundClient = clients.find((c) => c.email === email);
    if (foundClient) {
      const mockClientUser = {
        id: foundClient.id,
        name: foundClient.name,
        email: foundClient.email,
        role: "client",
      };
      setToken("mock-client-token");
      setUser(mockClientUser);
      localStorage.setItem("token", "mock-client-token");
      localStorage.setItem("user", JSON.stringify(mockClientUser));
      return;
    }

    setError("Hibás belépési adatok!");
  };

  // Regisztráció
  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanCode = inviteCode.trim().toUpperCase();
    if (!activeCodes.includes(cleanCode)) {
      setError("Érvénytelen vagy már felhasznált meghívókód!");
      return;
    }

    const newClientId = String(Date.now());
    const newClient = { id: newClientId, name, email, role: "client" };

    setClients((prev) => [...prev, newClient]);
    setActiveCodes((prev) => prev.filter((c) => c !== cleanCode));
    setSelectedClient(newClientId);

    setSuccessMsg("Sikeres regisztráció! Most már bejelentkezhetsz.");
    setAuthMode("login");
    setPassword("");
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.clear();
  };

  const generateInvite = () => {
    const code =
      "GORVIN-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setActiveCodes((prev) => [...prev, code]);
  };

  // Edzésterv mentése az adott dátumra és kliensre
  const saveWorkout = () => {
    const key = `${selectedClient}_${selectedDate}`;
    setWorkouts((prev) => ({ ...prev, [key]: workoutInput }));
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  // --- BEJELENTKEZÉS / REGISZTRÁCIÓ ---
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-black text-purple-500 mb-1 text-center tracking-wider">
            GORVIN TRAIN DIARY
          </h1>
          <p className="text-xs text-zinc-500 text-center mb-6">
            Személyi Edző & Kliens Rendszer
          </p>

          <div className="flex bg-zinc-950 p-1 rounded-xl mb-6 border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === "login"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Bejelentkezés
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === "register"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Kliens Regisztráció
            </button>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-950/50 border border-emerald-500/50 text-emerald-400 text-xs p-3 rounded-lg mb-4 text-center">
              {successMsg}
            </div>
          )}

          {authMode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">
                  Email / Felhasználónév
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Edzőnek: G"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm mt-1 focus:outline-none focus:border-purple-500 text-zinc-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">
                  Jelszó
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Edzőnek: 123"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm mt-1 focus:outline-none focus:border-purple-500 text-zinc-100"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg text-sm transition mt-2 shadow-lg shadow-purple-600/30"
              >
                Bejelentkezés
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400">
                  Teljes Név
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Kovács Péter"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm mt-1 focus:outline-none focus:border-purple-500 text-zinc-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">
                  Email Cím
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="peter@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm mt-1 focus:outline-none focus:border-purple-500 text-zinc-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">
                  Jelszó
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm mt-1 focus:outline-none focus:border-purple-500 text-zinc-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-purple-400">
                  Meghívókód
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                  placeholder="GORVIN-XXXXXX"
                  className="w-full bg-zinc-950 border border-purple-500/50 rounded-lg p-3 text-sm mt-1 focus:outline-none focus:border-purple-500 text-purple-300 font-mono uppercase"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg text-sm transition mt-2 shadow-lg shadow-purple-600/30"
              >
                Regisztráció Kliensként
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- BELSŐ NÉZET NAPTÁRRAL ---
  const twoWeeks = getNextTwoWeeks();
  const activeClientId =
    user.role === "client" ? String(user.id) : selectedClient;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-6">
      <header className="flex justify-between items-center pb-6 border-b border-zinc-800 max-w-5xl mx-auto mb-6">
        <div>
          <h1 className="text-xl font-black text-purple-500 tracking-wider">
            GORVIN TRAIN DIARY
          </h1>
          <p className="text-xs text-zinc-400">
            Üdv,{" "}
            <span className="text-purple-300 font-semibold">{user.name}</span> (
            {user.role === "trainer" ? "Edző" : "Kliens"})
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 text-xs px-4 py-2 rounded-lg font-medium transition"
        >
          Kijelentkezés
        </button>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        {/* EDZŐI VEZÉRLŐPULT */}
        {user.role === "trainer" && (
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
                    <span className="text-[10px] text-zinc-400 block">
                      Kód:
                    </span>
                    <span className="text-sm font-mono font-bold text-purple-400 select-all">
                      {generatedCode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2 HETES NAPTÁR SÁV */}
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
                  <p className="text-[10px] font-medium uppercase opacity-75">
                    {d.dayName}
                  </p>
                  <p className="text-base font-bold my-0.5">{d.dayNum}</p>
                  <p className="text-[9px] opacity-60">{d.month}</p>

                  <div className="mt-1 flex justify-center">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${hasWorkout ? (isSelected ? "bg-white" : "bg-purple-400") : "bg-transparent"}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* EDZÉSTERV NÉZET ÉS SZERKESZTŐ */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-zinc-100 text-base">
                {selectedDate === todayStr
                  ? "Mai edzés"
                  : `Edzésterv erre a napra:`}
              </h3>
              <p className="text-xs text-purple-400 font-mono">
                {selectedDate}
              </p>
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
      </main>
    </div>
  );
}
