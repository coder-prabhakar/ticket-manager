import { Typography } from "antd";  

const { Title } = Typography;

export const Header = ({ children }) => {
    return (
        <div className="min-h-18 py-4 flex items-center justify-between flex-wrap gap-2">
            {children}
        </div>
    )
};

export const Heading = ({ type = "", children }) => {
    return <Title level={4} style={{marginBottom: '4px'}} type={type}>{children}</Title>
};