const fetcher = async (url: string | Request | URL) => {
  const response = await fetch(url);
  return response.json();
};

export default fetcher;
