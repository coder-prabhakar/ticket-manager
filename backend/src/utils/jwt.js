import jwt from "jsonwebtoken";

export const generateTokenForCustomer = (customer) => {
    return jwt.sign(
        { 
            code: customer.customer_code, 
            role: "customer" 
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
};

export const generateTokenForMember = (employee) => {
    return jwt.sign(
        { 
            code: employee.employee_code, 
            role: employee.employee_role 
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
};