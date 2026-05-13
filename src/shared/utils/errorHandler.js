export const handleError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 403) {
      return "You are not authorized to view this page";
    }

    return data?.detail || data?.title || "Something went wrong";
  }

  if (error.request) {
    return "Server is down or no response";
  }

  return error.message || "Unexpected error";
};