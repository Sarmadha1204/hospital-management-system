import { useEffect, useState } from "react";
import {
  getAppointments,
  deleteAppointment,
  cancelAppointment,
} from "../services/appointmentService";
import AppointmentForm from "../components/AppointmentForm";
import "./Appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const [filters, setFilters] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showAppointmentForm, setShowAppointmentForm] =
    useState(false);

  const [appointmentToEdit, setAppointmentToEdit] =
    useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments(filterValues = filters) {
    try {
      setLoading(true);
      setError("");

      const data = await getAppointments(filterValues);

      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);
    setSuccess("");

    loadAppointments(updatedFilters);
  }

  function handleEdit(appointment) {
    setSuccess("");
    setAppointmentToEdit(appointment);
    setShowAppointmentForm(true);
  }

  async function handleCancel(id) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await cancelAppointment(id);

      setSuccess("Appointment cancelled successfully.");

      await loadAppointments(filters);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteAppointment(id);

      setSuccess("Appointment deleted successfully.");

      await loadAppointments(filters);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <div>
          <h1>Appointments</h1>
          <p>Manage patient appointments</p>
        </div>

        <button
          className="add-appointment-button"
          onClick={() => {
            setSuccess("");
            setAppointmentToEdit(null);
            setShowAppointmentForm(true);
          }}
        >
          Add Appointment
        </button>
      </div>

      <div className="appointments-toolbar">
        <input
          type="text"
          name="patientId"
          placeholder="Filter by patient ID..."
          value={filters.patientId}
          onChange={handleFilterChange}
        />

        <input
          type="text"
          name="doctorId"
          placeholder="Filter by doctor ID..."
          value={filters.doctorId}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {success && (
        <p className="success-message">
          {success}
        </p>
      )}

      {loading && <p>Loading appointments...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="appointments-table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Appointment Code</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
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

                    <td>
                      <button
                        onClick={() =>
                          handleEdit(appointment)
                        }
                      >
                        Edit
                      </button>

                      {appointment.status?.toLowerCase() !==
                        "cancelled" && (
                        <button
                          onClick={() =>
                            handleCancel(appointment.id)
                          }
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleDelete(appointment.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAppointmentForm && (
        <AppointmentForm
          appointmentToEdit={appointmentToEdit}
          onClose={() => {
            setShowAppointmentForm(false);
            setAppointmentToEdit(null);
          }}
          onAppointmentCreated={() => {
            setSuccess("Appointment created successfully.");
            loadAppointments(filters);
          }}
          onAppointmentUpdated={() => {
            setSuccess("Appointment updated successfully.");
            loadAppointments(filters);
          }}
        />
      )}
    </div>
  );
}

export default Appointments;