export const getStatusLabel = (status) => {
    return (
        <span className={`badge ${status ? "bg-success" : "bg-danger"}`}>
            {status ? "Active" : "Inactive"}
        </span>
    );
};

export const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // e.g. 04/11/2025
};

// Capitalize text
export const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};