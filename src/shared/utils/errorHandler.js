export const handleError = (error) => {

  const status = error.response.status;
  const data = error.response.data;
  
  if (status === 403) {
    return "You are not authorized to view this page";
  }

  if (error.response) {

    return data.detail || data.title || "Something went wrong";
  }

  if (error.request) {
    return "Network error, try again";
  }

  return error.message || "Unexpected error";
};