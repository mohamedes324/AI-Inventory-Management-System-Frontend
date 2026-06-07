export const handleError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 403) {
      return "You are not authorized to view this page";
    }

    // Handle ASP.NET validation errors: { errors: { field: [messages] } }
    if (data?.errors && typeof data.errors === "object") {
      const firstMessages = Object.values(data.errors).flat();
      if (firstMessages.length > 0) {
        return firstMessages[0];
      }
    }

    return data?.detail || data?.title || data?.message || "Something went wrong";
  }

  if (error.request) {
    return "Server is down or no response";
  }

  return error.message || "Unexpected error";
};