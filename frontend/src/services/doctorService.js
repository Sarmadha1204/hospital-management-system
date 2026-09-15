const API_BASE_URL = "http://localhost:8080/api/doctors";

export async function getDoctors(specialization = "") {
  const url = specialization.trim()
    ? `${API_BASE_URL}?specialization=${encodeURIComponent(specialization)}`
    : API_BASE_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return response.json();
}

export async function getDoctorById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch doctor");
  }

  return response.json();
}

export async function createDoctor(doctor) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doctor),
  });

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to create doctor";

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

export async function updateDoctor(id, doctor) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doctor),
  });

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to update doctor";

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

export async function deleteDoctor(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to delete doctor";

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