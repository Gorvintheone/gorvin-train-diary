import React, { useState, useEffect } from "react";
import { getWorkouts } from "./services/api";
import LoginView from "./components/LoginView";
import TrainerControls from "./components/TrainerControls";
import CalendarBar from "./components/CalendarBar";
import WorkoutEditor from "./components/WorkoutEditor";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [clients, setClients] = useState([
    { id: "1", name: "Minta Kliens Péter", email: "peter@test.com" },
  ]);
  const [selectedClient, setSelectedClient] = useState("1");

  const [todayStr] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [workouts, setWorkouts] = useState({});

  const [workoutInput, setWorkoutInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [savedStatus, setSavedStatus] = useState(false);
  const [activeCodes, setActiveCodes] = useState(["GORVIN-DEMO12"]);

  useEffect(() => {
    getWorkouts()
      .then((data) => {
        if (Array.isArray(data)) {
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

  useEffect(() => {
    const activeClientId =
      user?.role === "client" ? String(user.id) : selectedClient;
    const key = `${activeClientId}_${selectedDate}`;
    setWorkoutInput(workouts[key] || "");
  }, [selectedClient, selectedDate, workouts, user]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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

  const saveWorkout = () => {
    const key = `${selectedClient}_${selectedDate}`;
    setWorkouts((prev) => ({ ...prev, [key]: workoutInput }));
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  if (!token) {
    return (
      <LoginView
        authMode={authMode}
        setAuthMode={setAuthMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        name={name}
        setName={setName}
        inviteCode={inviteCode}
        setInviteCode={setInviteCode}
        error={error}
        setError={setError}
        successMsg={successMsg}
        setSuccessMsg={setSuccessMsg}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />
    );
  }

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
        {user.role === "trainer" && (
          <TrainerControls
            clients={clients}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            generateInvite={generateInvite}
            generatedCode={generatedCode}
          />
        )}

        <CalendarBar
          twoWeeks={twoWeeks}
          workouts={workouts}
          activeClientId={activeClientId}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <WorkoutEditor
          selectedDate={selectedDate}
          todayStr={todayStr}
          user={user}
          workoutInput={workoutInput}
          setWorkoutInput={setWorkoutInput}
          saveWorkout={saveWorkout}
          savedStatus={savedStatus}
        />
      </main>
    </div>
  );
}
