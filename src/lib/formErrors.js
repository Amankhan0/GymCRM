// Map a 409 Conflict from the API onto a specific form field via react-hook-form's setError.
// Returns true if it handled the error (caller should skip the toast); false otherwise.
export function applyServerError(error, setError, field = 'email') {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;
  if (status === 409 && message) {
    setError(field, { type: 'server', message });
    return true;
  }
  return false;
}
