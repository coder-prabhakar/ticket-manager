import { LuSquareArrowOutUpRight } from "react-icons/lu";


export const TaskCard = ({ task, onClick }) => {
    const { task_title, task_description, customer_name, member_name, task_deadline } = task;

    return (
        <div 
            onClick={onClick}
            className="group w-full bg-white shadow-sm rounded-sm p-3 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:shadow-xl active:shadow-primary"
        >
            <div className='text-xs font-medium text-gray-500 pb-3 border-b border-gray-200 flex items-center justify-between'>
                <span>{customer_name}</span>
                <LuSquareArrowOutUpRight className="text-sm group-hover:text-primary cursor-pointer transition-all duration-200"/>
            </div>
            <div>
                <h2 className="text-sm font-medium text-gray-800">{task_title}</h2>
                <p className='text-xs leading-4.5 text-gray-500 mt-1.5 line-clamp-2'>{task_description}</p>
            </div>
            <div className='text-xs font-medium text-gray-800 flex items-center justify-between gap-4'>
                <p className='flex flex-col gap-0.5'>
                    <span className='text-gray-500'>Assign To</span>
                    <span>{member_name ? member_name : "N/A"}</span>
                </p>
                <p className='flex flex-col gap-0.5'>
                    <span className='text-gray-500'>Deadline</span>
                    <span>{task_deadline ? new Date(task_deadline).toLocaleDateString("en-GB") : "N/A"}</span>
                </p>
            </div>
        </div>
    )
};