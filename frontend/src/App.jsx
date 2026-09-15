import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="app">
      <nav className="app-navigation">
        <button
          onClick={() => setCurrentPage("dashboard")}
        >
          Dashboard
        </button>

        <button
          onClick={() => setCurrentPage("patients")}
        >
          Patients
        </button>

        <button
          onClick={() => setCurrentPage("doctors")}
        >
          Doctors
        </button>

        <button
          onClick={() => setCurrentPage("appointments")}
        >
          Appointments
        </button>
      </nav>

      {currentPage === "dashboard" && <Dashboard />}

      {currentPage === "patients" && <Patients />}

      {currentPage === "doctors" && <Doctors />}

      {currentPage === "appointments" && <Appointments />}
    </div>
  );
}

export default App;