import { useEffect, useState } from "react";
import {
  getPatients,
  deletePatient,
} from "../services/patientService";
import { getPatientAppointments } from "../services/patientAppointmentService";
import PatientForm from "../components/PatientForm";
import "./Patients.css";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const [showHistory, setShowHistory] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients(searchValue = "") {
    try {
      setLoading(true);
      setError("");

      const data = await getPatients(searchValue);
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    const value = event.target.value;

    setSearch(value);
    loadPatients(value);
  }

  function handleEdit(patient) {
    setPatientToEdit(patient);
    setShowPatientForm(true);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deletePatient(id);

      await loadPatients(search);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleViewHistory(patient) {
    try {
      setHistoryLoading(true);
      setError("");

      const appointments = await getPatientAppointments(
        patient.id
      );

      setSelectedPatient(patient);
      setPatientAppointments(appointments);
      setShowHistory(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  function closeHistory() {
    setShowHistory(false);
    setSelectedPatient(null);
    setPatientAppointments([]);
  }

  return (
    <div className="patients-page">
      <div className="patients-header">
        <div>
          <h1>Patients</h1>
          <p>Manage patient records</p>
        </div>

        <button
          className="add-patient-button"
          onClick={() => {
            setPatientToEdit(null);
            setShowPatientForm(true);
          }}
        >
          Add Patient
        </button>
      </div>

      <div className="patients-toolbar">
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {loading && <p>Loading patients...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="patients-table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient Code</th>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.patientCode}</td>

                    <td>
                      {patient.firstName} {patient.lastName}
                    </td>

                    <td>{patient.dateOfBirth}</td>

                    <td>{patient.gender}</td>

                    <td>{patient.phone}</td>

                    <td>{patient.email || "-"}</td>

                    <td>
                      <button
                        onClick={() =>
                          handleViewHistory(patient)
                        }
                      >
                        History
                      </button>

                      <button
                        onClick={() => handleEdit(patient)}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(patient.id)
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

      {showPatientForm && (
        <PatientForm
          patientToEdit={patientToEdit}
          onClose={() => {
            setShowPatientForm(false);
            setPatientToEdit(null);
          }}
          onPatientCreated={() => {
            loadPatients(search);
          }}
          onPatientUpdated={() => {
            loadPatients(search);
          }}
        />
      )}

      {showHistory && selectedPatient && (
        <div className="patient-history-overlay">
          <div className="patient-history-container">
            <div className="patient-history-header">
              <div>
                <h2>Appointment History</h2>

                <p>
                  {selectedPatient.patientCode} -{" "}
                  {selectedPatient.firstName}{" "}
                  {selectedPatient.lastName}
                </p>
              </div>

              <button
                type="button"
                onClick={closeHistory}
              >
                ×
              </button>
            </div>

            {historyLoading && (
              <p>Loading appointment history...</p>
            )}

            {!historyLoading &&
              patientAppointments.length === 0 && (
                <p>No appointments found for this patient.</p>
              )}

            {!historyLoading &&
              patientAppointments.length > 0 && (
                <div className="patient-history-table-container">
                  <table className="patient-history-table">
                    <thead>
                      <tr>
                        <th>Appointment Code</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {patientAppointments.map(
                        (appointment) => (
                          <tr key={appointment.id}>
                            <td>
                              {appointment.appointmentCode}
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

            <div className="patient-history-actions">
              <button
                type="button"
                onClick={closeHistory}
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

export default Patients;