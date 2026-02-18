export function getApiError(error) {
    if (error.response) return error.response.data?.message || "Server error";
    if (error.request) return "Network error — check connection";
    return "Unexpected error";
}
