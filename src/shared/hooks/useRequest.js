import { useState } from "react";

export const useRequest = (requestFn) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const execute = async (...args) => {
        try {
            setLoading(true);
            setError("");

            const data = await requestFn(...args);

            return data;
        } catch (err) {
            const normalizedError = {
                message: err?.message || "Something went wrong",
                status: err?.response?.status || null,
            };

            setError(normalizedError);
            throw normalizedError;
        } finally {
            setLoading(false);
        }
    };

    return {
        execute,
        loading,
        error,
    };
};