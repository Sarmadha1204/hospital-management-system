const API_BASE_URL = "http://localhost:8080/api/appointments";

export async function getAppointments(filters = {}) {
  const params = new URLSearchParams();

  if (filters.patientId) {
    params.append("patientId", filters.patientId);
  }

  if (filters.doctorId) {
    params.append("doctorId", filters.doctorId);
  }

  if (filters.date) {
    params.append("date", filters.date);
  }

  if (filters.status) {
    params.append("status", filters.status);
  }

  const queryString = params.toString();

  const url = queryString
    ? `${API_BASE_URL}?${queryString}`
    : API_BASE_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json();
}

export async function getAppointmentById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch appointment");
  }

  return response.json();
}

export async function createAppointment(appointment) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to create appointment";

    if (responseText) {
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = responseText;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updateAppointment(id, appointment) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointment),
  });

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to update appointment";

    if (responseText) {
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = responseText;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function cancelAppointment(id) {
  const response = await fetch(
    `${API_BASE_URL}/${id}/cancel`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to cancel appointment";

    if (responseText) {
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = responseText;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function deleteAppointment(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to delete appointment";

    if (responseText) {
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = responseText;
      }
    }

    throw new Error(errorMessage);
  }
}