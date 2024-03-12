// import useSWR from 'swr';
import {
  IMessage,
  NotificationBell,
  NovuProvider,
  PopoverNotificationCenter,
} from '@novu/notification-center';

// import fetcher from './utils/swr/fetcher.ts';

function App() {
  // const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
  // const { data, error, isLoading } = useSWR(BASE_URL, fetcher);
  // return (
  //   <>
  //     {data && <p>{JSON.stringify(data)}</p>}
  //     {error && <p>{JSON.stringify(error)}</p>}
  //     {isLoading && <p>{JSON.stringify(isLoading)}</p>}
  //   </>
  // );
  const handleOnNotificationClick = (message: IMessage) => {
    // your logic to handle the notification click
    if (message?.cta?.data?.url) {
      window.location.href = message.cta.data.url;
    }
  };
  return (
    <NovuProvider
      subscriberId="65ee10b25481655e46ce747d"
      applicationIdentifier="ADW8ubDtIU7S"
    >
      <PopoverNotificationCenter
        colorScheme="dark"
        onNotificationClick={handleOnNotificationClick}
      >
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
}

export default App;
