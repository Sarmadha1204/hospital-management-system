import { useEffect, useState } from "react";
import {
  createPatient,
  updatePatient,
} from "../services/patientService";
import "./PatientForm.css";

function PatientForm({
  onClose,
  onPatientCreated,
  onPatientUpdated,
  patientToEdit = null,
}) {
  const [formData, setFormData] = useState({
    patientCode: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    bloodGroup: "",
    address: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = patientToEdit !== null;

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        patientCode: patientToEdit.patientCode || "",
        firstName: patientToEdit.firstName || "",
        lastName: patientToEdit.lastName || "",
        dateOfBirth: patientToEdit.dateOfBirth || "",
        gender: patientToEdit.gender || "",
        phone: patientToEdit.phone || "",
        email: patientToEdit.email || "",
        bloodGroup: patientToEdit.bloodGroup || "",
        address: patientToEdit.address || "",
      });
    }
  }, [patientToEdit]);

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

      if (isEditMode) {
        const updatedPatient = await updatePatient(
          patientToEdit.id,
          formData
        );

        if (onPatientUpdated) {
          onPatientUpdated(updatedPatient);
        }
      } else {
        const createdPatient = await createPatient(formData);

        if (onPatientCreated) {
          onPatientCreated(createdPatient);
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
    <div className="patient-form-overlay">
      <div className="patient-form-container">
        <div className="patient-form-header">
          <h2>
            {isEditMode ? "Edit Patient" : "Add Patient"}
          </h2>

          <button
            type="button"
            className="patient-form-close"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="patient-form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="patient-form-grid">
            <div className="form-group">
              <label htmlFor="patientCode">
                Patient Code
              </label>

              <input
                id="patientCode"
                name="patientCode"
                type="text"
                value={formData.patientCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">
                Date of Birth
              </label>

              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bloodGroup">
                Blood Group
              </label>

              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className="patient-form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-patient-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditMode
                  ? "Update Patient"
                  : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;