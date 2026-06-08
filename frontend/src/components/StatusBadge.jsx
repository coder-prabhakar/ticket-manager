export const StatusBadge = ({ status }) => {
    const globalStatusClasses = "text-white inline-block px-2 pt-0.5 pb-1 text-xs font-medium rounded-lg";

    switch(status.toLowerCase()){
        case "pending":
            return <span className={`bg-yellow-600 ${globalStatusClasses}`}>Pending</span>;
        case "in_progress":
            return <span className={`bg-blue-600 ${globalStatusClasses}`}>Progress</span>;
        case "completed":
            return <span className={`bg-green-600 ${globalStatusClasses}`}>Completed</span>;
        case "closed":
            return <span className={`bg-gray-500 ${globalStatusClasses}`}>Closed</span>;
        default:
            return <></>;
    }
};