import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_ROUTES } from '@/constants/routes';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';

export default function AuthTabs({ route }: { route: string }) {
  const navigate = useNavigate();
  return (
    <Card className="max-w-full w-[450px] h-[500px] font-natosans" radius="sm">
      <CardBody className="overflow-hidden">
        <Tabs
          fullWidth
          size="md"
          radius="sm"
          aria-label="Auth form"
          selectedKey={route}
          variant="underlined"
          onSelectionChange={(key) => navigate(key as string)}
          classNames={{
            tabList:
              'gap-6 w-full relative rounded-none p-0 border-b border-divider',
            cursor: 'w-full bg-pink-600',
            tab: 'py-3',
            tabContent: 'group-data-[selected=true]:text-pink-600',
          }}
        >
          <Tab key={CLIENT_ROUTES.AUTH_LOGIN} title="Login" className="h-full">
            <Login />
          </Tab>
          <Tab
            key={CLIENT_ROUTES.AUTH_SIGNUP}
            title="Sign up"
            className="h-full"
          >
            <SignUp />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
