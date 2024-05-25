import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://examarchive-1.onrender.com/api/v1/',
});

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);
export default fetcher;
