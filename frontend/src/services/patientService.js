const API_BASE_URL = "http://localhost:8080/api/patients";

export async function getPatients(search = "") {
  const url = search.trim()
    ? `${API_BASE_URL}?search=${encodeURIComponent(search)}`
    : API_BASE_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  return response.json();
}

export async function getPatientById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch patient");
  }

  return response.json();
}

export async function createPatient(patient) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to create patient";

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

export async function updatePatient(id, patient) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to update patient";

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

export async function deletePatient(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const responseText = await response.text();

    let errorMessage = "Failed to delete patient";

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