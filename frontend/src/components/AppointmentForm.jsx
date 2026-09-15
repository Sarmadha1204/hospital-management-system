import { useEffect, useState } from "react";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import {
  createAppointment,
  updateAppointment,
} from "../services/appointmentService";
import "./AppointmentForm.css";

function AppointmentForm({
  onClose,
  onAppointmentCreated,
  onAppointmentUpdated,
  appointmentToEdit = null,
}) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    appointmentCode: "",
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "Scheduled",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = appointmentToEdit !== null;

  useEffect(() => {
    loadFormData();
  }, []);

  useEffect(() => {
    if (appointmentToEdit) {
      setFormData({
        appointmentCode:
          appointmentToEdit.appointmentCode || "",

        patientId:
          appointmentToEdit.patient?.id
            ? String(appointmentToEdit.patient.id)
            : "",

        doctorId:
          appointmentToEdit.doctor?.id
            ? String(appointmentToEdit.doctor.id)
            : "",

        appointmentDate:
          appointmentToEdit.appointmentDate || "",

        appointmentTime:
          appointmentToEdit.appointmentTime
            ? appointmentToEdit.appointmentTime.substring(0, 5)
            : "",

        reason:
          appointmentToEdit.reason || "",

        status:
          appointmentToEdit.status || "Scheduled",

        notes:
          appointmentToEdit.notes || "",
      });
    }
  }, [appointmentToEdit]);

  async function loadFormData() {
    try {
      setLoading(true);
      setError("");

      const [patientData, doctorData] = await Promise.all([
        getPatients(),
        getDoctors(),
      ]);

      setPatients(patientData);
      setDoctors(doctorData);
    } catch (err) {
      setError("Failed to load patients and doctors.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const appointmentData = {
        appointmentCode: formData.appointmentCode,

        patient: {
          id: Number(formData.patientId),
        },

        doctor: {
          id: Number(formData.doctorId),
        },

        appointmentDate: formData.appointmentDate,

        appointmentTime: formData.appointmentTime,

        reason: formData.reason,

        status: formData.status,

        notes: formData.notes,
      };

      if (isEditMode) {
        const updatedAppointment =
          await updateAppointment(
            appointmentToEdit.id,
            appointmentData
          );

        if (onAppointmentUpdated) {
          onAppointmentUpdated(updatedAppointment);
        }
      } else {
        const createdAppointment =
          await createAppointment(appointmentData);

        if (onAppointmentCreated) {
          onAppointmentCreated(createdAppointment);
        }
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="appointment-form-overlay">
      <div className="appointment-form-container">
        <div className="appointment-form-header">
          <h2>
            {isEditMode
              ? "Edit Appointment"
              : "Add Appointment"}
          </h2>

          <button
            type="button"
            className="appointment-form-close"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>
        </div>

        {loading && (
          <p>Loading patients and doctors...</p>
        )}

        {error && (
          <div className="appointment-form-error">
            {error}
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className="appointment-form-grid">
              <div className="form-group">
                <label htmlFor="appointmentCode">
                  Appointment Code
                </label>

                <input
                  id="appointmentCode"
                  name="appointmentCode"
                  type="text"
                  value={formData.appointmentCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="patientId">
                  Patient
                </label>

                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select patient
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.patientCode} -{" "}
                      {patient.firstName}{" "}
                      {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="doctorId">
                  Doctor
                </label>

                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select doctor
                  </option>

                  {doctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.doctorCode} - {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="appointmentDate">
                  Appointment Date
                </label>

                <input
                  id="appointmentDate"
                  name="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointmentTime">
                  Appointment Time
                </label>

                <input
                  id="appointmentTime"
                  name="appointmentTime"
                  type="time"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="reason">
                  Reason
                </label>

                <input
                  id="reason"
                  name="reason"
                  type="text"
                  value={formData.reason}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="notes">
                  Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="appointment-form-actions">
              <button
                type="button"
                className="cancel-appointment-button"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-appointment-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : isEditMode
                    ? "Update Appointment"
                    : "Save Appointment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AppointmentForm;