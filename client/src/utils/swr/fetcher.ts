import axios, { AxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const fetcher = async (req: AxiosRequestConfig<any>) => {
  const res = await axiosInstance(req);
  return res;
};
export default fetcher;
