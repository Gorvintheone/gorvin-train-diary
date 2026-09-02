import React from "react";

export default function LoginView({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  inviteCode,
  setInviteCode,
  error,
  setError,
  successMsg,
  setSuccessMsg,
  handleLogin,
  handleRegister,
}) {
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
              <label className="text-xs font-medium text-zinc-400">Jelszó</label>
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
              <label className="text-xs font-medium text-zinc-400">Jelszó</label>
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
