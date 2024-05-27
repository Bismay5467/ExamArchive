import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
export default fetcher;
