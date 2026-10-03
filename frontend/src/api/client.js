import axios from "axios";

const apiClient = axios.create({ baseURL: "http://localhost:8000" });

apiClient.interceptors.request.use(
    (config) => {
        //Add the required request headers here
        const token = localStorage.getItem("medflow_authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
)

export default apiClient;
