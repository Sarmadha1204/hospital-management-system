const API_BASE_URL = "http://localhost:8080/api/appointments";

export async function getDoctorAppointments(doctorId) {
  const response = await fetch(
    `${API_BASE_URL}/doctor/${doctorId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch doctor appointments");
  }

  return response.json();
}