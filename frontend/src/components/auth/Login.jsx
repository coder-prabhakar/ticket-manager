import { useState } from "react";
import { useNavigate } from "react-router";
import { useAlert } from "../../utils/useAlert.jsx";
import axiosInstance from "../../api/axiosInstance.js";
import { setDataInLocalStorage } from "../../utils/localStorage.js";


export default function Login() {
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("");
    const [isLogin, setIsLogin] = useState(false);

    const navigate = useNavigate();

    const { alertComponent, showAlert } = useAlert();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLogin(true);

        try {
            const response = await axiosInstance.post("/api/auth/login", { code, password, accountType });
            setDataInLocalStorage(response.data);
            navigate("/");

        } catch (error) {
            showAlert( "error", "Error", error.response?.data?.message || error.message);
        } finally {
            setIsLogin(false);
        }
    };

    return (
        <>
            {alertComponent}
        
            <main className='w-full min-h-screen p-4 flex items-center justify-center bg-gray-100'>
                <div className='max-w-100 p-4 sm:p-8 shadow-sm rounded-xl bg-white'>
                    <h1 className='text-2xl font-bold text-gray-800 text-center'>Welcome Back</h1>
                    <p className='text-gray-600 text-center'>Please enter your details to login</p>

                    <form className="flex flex-col gap-4 mt-6 w-full" onSubmit={handleLogin}>
                        <div className="flex flex-col gap-2.5 w-full">
                            <label className="text-sm text-gray-600 leading-3">Code</label>
                            <input 
                                type="text" 
                                className="input w-full text-gray-700 outline-none" 
                                placeholder='Enter your Code' 
                                required
                                onChange={(e) => setCode(e.target.value)}
                            /> 
                        </div>

                        <div className="flex flex-col gap-2.5 w-full">
                            <label className="text-sm text-gray-600 leading-3">Password</label>
                            <input 
                                type="password" 
                                className="input w-full text-gray-700 outline-none" 
                                placeholder='Enter your password' 
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            /> 
                        </div>

                        <div className="flex gap-6 my-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="member"
                                    required
                                    checked={accountType === "member"}
                                    onChange={(e) => setAccountType(e.target.value)}
                                />
                                <span className="text-sm text-gray-600 leading-3">Member</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="customer"
                                    checked={accountType === "customer"}
                                    onChange={(e) => setAccountType(e.target.value)}
                                />
                                <span className="text-sm text-gray-600 leading-3">Customer</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="btn text-white font-normal bg-primary hover:bg-blue-800" 
                            disabled={isLogin}
                        >
                            {isLogin ? "Login..." : "Login"}
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
};