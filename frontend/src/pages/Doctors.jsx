import { useEffect, useState } from "react";
import {
  getDoctors,
  deleteDoctor,
} from "../services/doctorService";
import DoctorForm from "../components/DoctorForm";
import "./Doctors.css";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState(null);

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
    </div>
  );
}

export default Doctors;