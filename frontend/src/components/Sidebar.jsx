import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { getInitials } from "../utils/getInitials.js";
import { TbReportSearch } from "react-icons/tb";
import { IoMenu, IoClose } from "react-icons/io5";
import { FiGrid, FiBriefcase, FiUsers, FiCheckSquare, FiPhone, FiLogOut } from 'react-icons/fi';
import { deleteDataFromLocalStorage, getDataFromLocalStorage } from "../utils/localStorage.js";


const SidebarItem = ({ path, icon, name }) => {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>`w-full p-4 flex items-center gap-4 transition-all duration-300
            ${isActive 
                ? 'bg-slate-800 text-white border-r-4 border-primary' 
                : 'text-slate-300 hover:bg-slate-800'
            }`}
        >
            <span className="text-xl">{icon}</span>
            <span className="font-medium tracking-wide">{name}</span>
        </NavLink>
    )
};


export default function Sidebar({ userRole }) {
    const navigate = useNavigate();
    const [sidebarActive, setSidebarActive] = useState(false);

    const data = getDataFromLocalStorage();
    const { name, role } = data?.user || {};

    const handleLogout = () => {
        deleteDataFromLocalStorage();
        navigate("/login");
    };

    return (
        <aside className={`sidebar ${sidebarActive ? "sidebar-active" : ""} h-dvh w-64 flex flex-col bg-[#060426]`}>
            {/*===== Toggle Button =====*/}
            <button 
                className="lg:hidden absolute top-4 left-68 h-10 w-10 rounded-lg text-2xl bg-[#060426] text-white cursor-pointer flex items-center justify-center"
                onClick={() => setSidebarActive((prev) => !prev)}
            >
                {sidebarActive ? <IoClose /> : <IoMenu />}
            </button>
            
            {/*===== Header =====*/}
            <div className="h-18 p-4 border-b border-slate-800 text-xl flex items-center justify-center gap-1.5">
                <span className='font-semibold text-primary'>Ticket</span>
                <span className="font-semibold text-white ">Manager</span>
            </div>

            {/*===== Navbar =====*/}
            <nav className="flex-1 flex flex-col overflow-y-auto">
                {[
                    { name: 'Dashboard', icon: <FiGrid size={20}/>, path: '/dashboard' },
                    { name: 'Tickets', icon: <FiCheckSquare size={20}/>, path: '/tickets' },
                    // { name: 'Reports', icon: <TbReportSearch size={20}/>, path: '/reports' },
                ].map(
                    (item) => <SidebarItem key={item.name} {...item} />
                )}

                {userRole === "admin" && (
                    [
                        { name: 'Members', icon: <FiUsers size={20}/>, path: '/members' },
                        { name: 'Customers', icon: <FiBriefcase size={20}/>, path: '/customers' },
                        { name: 'Projects', icon: <FiBriefcase size={20}/>, path: '/projects' },
                    ].map(
                        (item) => <SidebarItem key={item.name} {...item} />
                    )
                )}

                {(userRole === "admin" || userRole === "customer") && (
                    [
                        { name: 'Contacts', icon: <FiPhone size={20}/>, path: '/contacts' },
                    ].map(
                        (item) => <SidebarItem key={item.name} {...item} />
                    )
                )}
            </nav>

            {/*===== Logout =====*/}
            <div>
                <button 
                    onClick={handleLogout}
                    className="w-full p-4 flex items-center gap-4 text-slate-300 hover:bg-red-900/20 hover:text-red-400 cursor-pointer transition-all duration-300"
                >
                    <FiLogOut size={20} />
                    <span className="font-medium tracking-wide">Logout</span>
                </button>
            </div>

            {/*===== Profile =====*/}
            {data?.user && (
                <div className="border-t border-slate-800 p-4 flex items-center gap-3">
                    {/* Avatar Section */}
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                        {getInitials(name)}
                    </div>

                    {/* User Details */}
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-white truncate">
                            {name}
                        </span>
                        <span className="text-xs text-blue-400 font-medium truncate uppercase ">
                            {role}
                        </span>
                    </div>
                </div>
            )}
        </aside>
    )
};