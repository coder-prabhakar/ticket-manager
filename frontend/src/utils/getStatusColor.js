export const getStatusColor = (status = "") => {
    switch(status.toLowerCase()){
        case "pending":
            return "text-yellow-600";
        case "in_progress":
            return "text-blue-600";
        case "completed":
            return "text-green-600";
        case "closed":
            return "text-gray-500";
        default:
            return "text-gray-700";
    }
};