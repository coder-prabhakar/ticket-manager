// For user
export const setDataInLocalStorage = (data) => {
    sessionStorage.setItem("v2sk_task_manager", JSON.stringify(data));
}

export const getDataFromLocalStorage = () => {
    return JSON.parse(sessionStorage.getItem("v2sk_task_manager"));
}

export const deleteDataFromLocalStorage = () => {
    sessionStorage.removeItem("v2sk_task_manager");
};