import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [countsResponse, appointmentsResponse] =
        await Promise.all([
          fetch("http://localhost:8080/api/dashboard/counts"),
          fetch(
            "http://localhost:8080/api/dashboard/upcoming-appointments"
          ),
        ]);

      if (!countsResponse.ok) {
        throw new Error("Failed to load dashboard counts");
      }

      if (!appointmentsResponse.ok) {
        throw new Error(
          "Failed to load upcoming appointments"
        );
      }

      const countsData = await countsResponse.json();
      const appointmentsData =
        await appointmentsResponse.json();

      setCounts(countsData);
      setUpcomingAppointments(appointmentsData);
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
        <>
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

          <div className="upcoming-appointments-section">
            <h2>Upcoming Appointments</h2>

            {upcomingAppointments.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              <div className="upcoming-appointments-table-container">
                <table className="upcoming-appointments-table">
                  <thead>
                    <tr>
                      <th>Appointment Code</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {upcomingAppointments.map(
                      (appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            {appointment.appointmentCode}
                          </td>

                          <td>
                            {appointment.patient
                              ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                              : "-"}
                          </td>

                          <td>
                            {appointment.doctor
                              ? appointment.doctor.name
                              : "-"}
                          </td>

                          <td>
                            {appointment.appointmentDate}
                          </td>

                          <td>
                            {appointment.appointmentTime}
                          </td>

                          <td>
                            {appointment.reason || "-"}
                          </td>

                          <td>
                            {appointment.status || "-"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;