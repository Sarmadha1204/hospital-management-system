import { useEffect, useState } from "react";
import {
  getDoctors,
  deleteDoctor,
} from "../services/doctorService";
import { getDoctorAppointments } from "../services/doctorAppointmentService";
import DoctorForm from "../components/DoctorForm";
import "./Doctors.css";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState(null);

  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors(specializationValue = "") {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctors(specializationValue);
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSpecializationChange(event) {
    const value = event.target.value;

    setSpecialization(value);
    loadDoctors(value);
  }

  function handleEdit(doctor) {
    setDoctorToEdit(doctor);
    setShowDoctorForm(true);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteDoctor(id);

      await loadDoctors(specialization);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleViewSchedule(doctor) {
    try {
      setScheduleLoading(true);
      setError("");

      const appointments = await getDoctorAppointments(
        doctor.id
      );

      setSelectedDoctor(doctor);
      setDoctorAppointments(appointments);
      setShowSchedule(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setScheduleLoading(false);
    }
  }

  function closeSchedule() {
    setShowSchedule(false);
    setSelectedDoctor(null);
    setDoctorAppointments([]);
  }

  return (
    <div className="doctors-page">
      <div className="doctors-header">
        <div>
          <h1>Doctors</h1>
          <p>Manage doctor information</p>
        </div>

        <button
          className="add-doctor-button"
          onClick={() => {
            setDoctorToEdit(null);
            setShowDoctorForm(true);
          }}
        >
          Add Doctor
        </button>
      </div>

      <div className="doctors-toolbar">
        <input
          type="text"
          placeholder="Filter by specialization..."
          value={specialization}
          onChange={handleSpecializationChange}
        />
      </div>

      {loading && <p>Loading doctors...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="doctors-table-container">
          <table className="doctors-table">
            <thead>
              <tr>
                <th>Doctor Code</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>{doctor.doctorCode}</td>

                    <td>{doctor.name}</td>

                    <td>{doctor.specialization}</td>

                    <td>{doctor.phone}</td>

                    <td>{doctor.email || "-"}</td>

                    <td>{doctor.availability || "-"}</td>

                    <td>
                      <button
                        onClick={() =>
                          handleViewSchedule(doctor)
                        }
                      >
                        Schedule
                      </button>

                      <button
                        onClick={() => handleEdit(doctor)}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(doctor.id)
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

      {showDoctorForm && (
        <DoctorForm
          doctorToEdit={doctorToEdit}
          onClose={() => {
            setShowDoctorForm(false);
            setDoctorToEdit(null);
          }}
          onDoctorCreated={() => {
            loadDoctors(specialization);
          }}
          onDoctorUpdated={() => {
            loadDoctors(specialization);
          }}
        />
      )}

      {showSchedule && selectedDoctor && (
        <div className="doctor-schedule-overlay">
          <div className="doctor-schedule-container">
            <div className="doctor-schedule-header">
              <div>
                <h2>Appointment Schedule</h2>

                <p>
                  {selectedDoctor.doctorCode} -{" "}
                  {selectedDoctor.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeSchedule}
              >
                ×
              </button>
            </div>

            {scheduleLoading && (
              <p>Loading appointment schedule...</p>
            )}

            {!scheduleLoading &&
              doctorAppointments.length === 0 && (
                <p>No appointments found for this doctor.</p>
              )}

            {!scheduleLoading &&
              doctorAppointments.length > 0 && (
                <div className="doctor-schedule-table-container">
                  <table className="doctor-schedule-table">
                    <thead>
                      <tr>
                        <th>Appointment Code</th>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {doctorAppointments.map(
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

            <div className="doctor-schedule-actions">
              <button
                type="button"
                onClick={closeSchedule}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;