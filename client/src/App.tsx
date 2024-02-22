import useSWR from 'swr';

import fetcher from './utils/swr/fetcher.ts';

function App() {
  const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
  const { data, error, isLoading } = useSWR(BASE_URL, fetcher);
  return (
    <>
      {data && <p>{JSON.stringify(data)}</p>}
      {error && <p>{JSON.stringify(error)}</p>}
      {isLoading && <p>{JSON.stringify(isLoading)}</p>}
    </>
  );
}

export default App;
