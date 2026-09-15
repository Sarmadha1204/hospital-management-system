import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardCounts();
  }, []);

  async function loadDashboardCounts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/dashboard/counts"
      );

      if (!response.ok) {
        throw new Error("Failed to load dashboard counts");
      }

      const data = await response.json();

      setCounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-page">
      <h1>Hospital Dashboard</h1>

      {loading && <p>Loading dashboard...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>Patients</h2>
            <p>{counts.patients}</p>
          </div>

          <div className="dashboard-card">
            <h2>Doctors</h2>
            <p>{counts.doctors}</p>
          </div>

          <div className="dashboard-card">
            <h2>Appointments</h2>
            <p>{counts.appointments}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;