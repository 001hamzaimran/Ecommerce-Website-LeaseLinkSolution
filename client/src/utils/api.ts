/**
 * API Utility for LeaseLink Solution
 * Handles secure de-masking of payloads and integrity headers
 */

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    // Add Integrity Header
    const headers = {
        ...(options.headers || {}),
        'x-app-integrity': import.meta.env.VITE_API_INTEGRITY_SECRET || 'leaselink_secure_2026'
    };

    const response = await fetch(endpoint, { ...options, headers });
    const data = await response.json();

    // If the response is masked, de-mask it
    if (data && data._s && data._d) {
        try {
            const decodedString = atob(data._d);
            return JSON.parse(decodedString);
        } catch (error) {
            console.error("Payload decryption failed:", error);
            return data;
        }
    }

    return data;
};
