import { useEffect, useState } from "react";
import {
  createDoctor,
  updateDoctor,
} from "../services/doctorService";
import "./DoctorForm.css";

function DoctorForm({
  onClose,
  onDoctorCreated,
  onDoctorUpdated,
  doctorToEdit = null,
}) {
  const [formData, setFormData] = useState({
    doctorCode: "",
    name: "",
    specialization: "",
    phone: "",
    email: "",
    availability: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = doctorToEdit !== null;

  useEffect(() => {
    if (doctorToEdit) {
      setFormData({
        doctorCode: doctorToEdit.doctorCode || "",
        name: doctorToEdit.name || "",
        specialization: doctorToEdit.specialization || "",
        phone: doctorToEdit.phone || "",
        email: doctorToEdit.email || "",
        availability: doctorToEdit.availability || "",
      });
    }
  }, [doctorToEdit]);

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
        const updatedDoctor = await updateDoctor(
          doctorToEdit.id,
          formData
        );

        if (onDoctorUpdated) {
          onDoctorUpdated(updatedDoctor);
        }
      } else {
        const createdDoctor = await createDoctor(formData);

        if (onDoctorCreated) {
          onDoctorCreated(createdDoctor);
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
    <div className="doctor-form-overlay">
      <div className="doctor-form-container">
        <div className="doctor-form-header">
          <h2>
            {isEditMode ? "Edit Doctor" : "Add Doctor"}
          </h2>

          <button
            type="button"
            className="doctor-form-close"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="doctor-form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="doctor-form-grid">
            <div className="form-group">
              <label htmlFor="doctorCode">
                Doctor Code
              </label>

              <input
                id="doctorCode"
                name="doctorCode"
                type="text"
                value={formData.doctorCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">
                Doctor Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialization">
                Specialization
              </label>

              <input
                id="specialization"
                name="specialization"
                type="text"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
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
              <label htmlFor="availability">
                Availability
              </label>

              <input
                id="availability"
                name="availability"
                type="text"
                placeholder="Example: Monday-Friday, 9 AM-5 PM"
                value={formData.availability}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="doctor-form-actions">
            <button
              type="button"
              className="cancel-doctor-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-doctor-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditMode
                  ? "Update Doctor"
                  : "Save Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorForm;