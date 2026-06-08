import { useQuery } from "@tanstack/react-query";
import { getReport } from "../api/report";

// ---------------------------------------------------
// Task Report Hook
// ---------------------------------------------------
export const useReport = ({ showAlert, filters }) => {

    return useQuery({
        queryKey: ["report", filters],

        queryFn: () => getReport(filters),

        enabled: !!filters, // IMPORTANT

        onError: (error) => {

            const msg =
                error?.response?.data?.message ||
                "Something went wrong";

            showAlert(
                "error",
                "Unable to Fetch Report",
                msg
            );
        }
    });
};