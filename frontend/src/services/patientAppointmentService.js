const API_BASE_URL = "http://localhost:8080/api/patients";

export async function getPatientAppointments(patientId) {
  const response = await fetch(
    `${API_BASE_URL}/${patientId}/appointments`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch patient appointments");
  }

  return response.json();
}