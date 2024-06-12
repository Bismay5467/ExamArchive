import axios, { AxiosRequestConfig } from 'axios';

export const fetcher = async (req: AxiosRequestConfig<any>) => {
  const res = await axios({
    ...req,
    baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  });
  return res;
};
export default fetcher;
