import { notification } from 'antd';

export const useAlert = () => {
    const [api, contextHolder] = notification.useNotification();
    
    const openNotificationWithIcon = (type, title, description) => {
        api[type]({
            title: title,
            description: description,
            showProgress: true,
            pauseOnHover: true,
        });
    };

    return { alertComponent: contextHolder, showAlert: openNotificationWithIcon }
};