import { useQuery } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";
import { getInitialData } from "../api/initial";


const DataContext = createContext();


export const DataProvider = ({ user, children }) => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["initialData", fromDate, toDate],
        queryFn: () => getInitialData({ fromDate, toDate }),
    });

    const { DashboardStats, MembersForDDL, CustomersForDDL, ProjectsForDDL } = data || {};

    const statusListForDDL = [
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Closed', value: 'closed' },
    ];

    return (
        <DataContext.Provider
            value={{
                user,
                isLoading, error, 
                fromDate, toDate, setFromDate, setToDate,
                refetch,
                DashboardStats, MembersForDDL, CustomersForDDL, ProjectsForDDL, 
                statusListForDDL
            }}
        >
            {children}
        </DataContext.Provider>
    );
};


export const useData = () => useContext(DataContext);