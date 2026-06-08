import dayjs from "dayjs";
import { useData } from "../../context/DataContext.jsx";
import { getStatusColor } from "../../utils/getStatusColor.js";
import { Comments } from "../Comments.jsx";
import { TiArrowSortedDown } from "react-icons/ti";
import { Typography, Dropdown, DatePicker, Select } from 'antd';

const { Title, Text } = Typography;


export const TicketDetails = ({ ticket }) => {
    const { 
        task_id, 
        task_title, 
        task_description, 
        customer_name, 
        project_name, 
        member_name, 
        created_at, 
        task_deadline, 
        completed_at, 
        task_status
    } = ticket || {};

    const { statusListForDDL } = useData();

    return (
        <>
            <div className="space-y-6">
                {/* Ticket Title */}
                <div>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                        Title
                    </span>
                    <p className="text-base font-medium text-slate-900 bg-slate-50 border border-slate-100 rounded-lg p-3 shadow-sm">
                        {task_title}
                    </p>
                </div>

                {/* Ticket Description */}
                <div>
                    <span className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                        Description
                    </span>
                    <div className="text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-3 min-h-25 leading-relaxed whitespace-pre-wrap">
                        {task_description}
                    </div>
                </div>

                {/* Metadata Grid Layout */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 pt-2">
                    {[
                        { label: 'Customer', value: customer_name || "N/A" },
                        { label: 'Project', value: project_name || "N/A" },
                        { label: 'Assign To', value: member_name || "N/A" },
                        { label: 'Created At', value: created_at ? dayjs(created_at).format("DD MMM YYYY") : "N/A" },
                        { label: 'Deadline', value: task_deadline ? dayjs(task_deadline).format("DD MMM YYYY") : "N/A" },
                        { label: 'Completed At', value: completed_at ? dayjs(completed_at).format("DD MMM YYYY") : "N/A" },
                        { label: 'Current Status', value: task_status ? 
                            <span className={getStatusColor(task_status)}>
                                {statusListForDDL.find(item => item.value === task_status).label}
                            </span> 
                            : 
                            "N/A" 
                        },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50/50 border border-slate-100 rounded-lg p-3">
                            <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">
                                {label}
                            </span>

                            <span className="text-sm font-semibold text-slate-800">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Comments taskId={task_id}/>
        </>
    )
};