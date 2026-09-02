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

  // Edzők listája és előtagjaik
  const [trainers, setTrainers] = useState([
    { id: "trainer_1", name: "Gorvin WS (Főadmin)", email: "G", prefix: "G" },
  ]);

  const [clients, setClients] = useState([
    { id: "1", name: "Minta Kliens Péter", email: "peter@test.com", trainerId: "trainer_1" },
  ]);
  const [selectedClient, setSelectedClient] = useState("1");

  const [todayStr] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [workouts, setWorkouts] = useState({});

  const [workoutInput, setWorkoutInput] = useState("");
  const [generatedClientCode, setGeneratedClientCode] = useState("");
  const [generatedTrainerCode, setGeneratedTrainerCode] = useState("");
  const [savedStatus, setSavedStatus] = useState(false);

  // Aktív kódok listái
  const [activeTrainerCodes, setActiveTrainerCodes] = useState(["EDZO-MASTER"]);
  const [activeClientCodes, setActiveClientCodes] = useState(["G-DEMO12"]);

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

    // Főadmin ellenőrzés
    if (email === "G" && password === "123") {
      const mockUser = trainers[0];
      mockUser.role = "trainer";
      setToken("mock-trainer-token");
      setUser(mockUser);
      localStorage.setItem("token", "mock-trainer-token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      return;
    }

    // Regisztrált többi edző ellenőrzése
    const foundTrainer = trainers.find((t) => t.email === email);
    if (foundTrainer) {
      const trainerUser = { ...foundTrainer, role: "trainer" };
      setToken("mock-trainer-token");
      setUser(trainerUser);
      localStorage.setItem("token", "mock-trainer-token");
      localStorage.setItem("user", JSON.stringify(trainerUser));
      return;
    }

    // Kliens ellenőrzése
    const foundClient = clients.find((c) => c.email === email);
    if (foundClient) {
      const mockClientUser = {
        id: foundClient.id,
        name: foundClient.name,
        email: foundClient.email,
        role: "client",
        trainerId: foundClient.trainerId,
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

    // 1. Ha EDZO kódot adott meg
    if (cleanCode.startsWith("EDZO-")) {
      if (!activeTrainerCodes.includes(cleanCode)) {
        setError("Érvénytelen vagy már felhasznált edzői meghívókód!");
        return;
      }

      // Előtag generálás a névből (pl. Pintér Gergő -> PG)
      const nameParts = name.trim().split(" ");
      const prefix = nameParts.length >= 2 
        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
        : name.substring(0, 2).toUpperCase();

      const newTrainerId = `trainer_${Date.now()}`;
      const newTrainer = {
        id: newTrainerId,
        name,
        email,
        prefix,
        role: "trainer",
      };

      setTrainers((prev) => [...prev, newTrainer]);
      setActiveTrainerCodes((prev) => prev.filter((c) => c !== cleanCode));
      setSuccessMsg("Sikeres edzői regisztráció! Most már bejelentkezhetsz.");
      setAuthMode("login");
      setPassword("");
      setInviteCode("");
      return;
    }

    // 2. Ha Kliens kódot adott meg (pl. PG-XXXXXX vagy G-XXXXXX)
    if (!activeClientCodes.includes(cleanCode)) {
      setError("Érvénytelen vagy már felhasznált kliens meghívókód!");
      return;
    }

    // Megkeressük, melyik edzőhöz tartozik a kód előtagja
    const prefix = cleanCode.split("-")[0];
    const targetTrainer = trainers.find((t) => t.prefix === prefix) || trainers[0];

    const newClientId = String(Date.now());
    const newClient = {
      id: newClientId,
      name,
      email,
      role: "client",
      trainerId: targetTrainer.id,
    };

    setClients((prev) => [...prev, newClient]);
    setActiveClientCodes((prev) => prev.filter((c) => c !== cleanCode));
    setSelectedClient(newClientId);

    setSuccessMsg("Sikeres kliens regisztráció! Most már bejelentkezhetsz.");
    setAuthMode("login");
    setPassword("");
    setInviteCode("");
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.clear();
  };

  // Kliens kód generálás az adott edző prefixével (pl. PG-1234AB)
  const generateClientInvite = () => {
    const currentTrainer = trainers.find((t) => t.id === user.id) || trainers[0];
    const prefix = currentTrainer.prefix || "G";
    const code = `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    setGeneratedClientCode(code);
    setActiveClientCodes((prev) => [...prev, code]);
  };

  // Főadmin edzői kód generálás
  const generateTrainerInvite = () => {
    const code = `EDZO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGeneratedTrainerCode(code);
    setActiveTrainerCodes((prev) => [...prev, code]);
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

  // Ha az edző bejelentkezett, csak a saját klienseit látja
  const filteredClients = user.id === "trainer_1" 
    ? clients 
    : clients.filter(c => c.trainerId === user.id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-6">
      <header className="flex justify-between items-center pb-6 border-b border-zinc-800 max-w-5xl mx-auto mb-6">
        <div>
          <h1 className="text-xl font-black text-purple-500 tracking-wider">
            GORVIN TRAIN DIARY
          </h1>
          <p className="text-xs text-zinc-400">
            Üdv,{" "}
            <span className="text-purple-300 font-semibold">{user.name}</span>{" "}
            {user.role === "trainer" ? `(Edző - Kód prefix: ${user.prefix})` : "(Kliens)"}
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
            clients={filteredClients}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            trainers={trainers}
            generateClientInvite={generateClientInvite}
            generatedClientCode={generatedClientCode}
            generateTrainerInvite={generateTrainerInvite}
            generatedTrainerCode={generatedTrainerCode}
            user={user}
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
