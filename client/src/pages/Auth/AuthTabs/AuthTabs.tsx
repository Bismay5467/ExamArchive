import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_ROUTES } from '@/constants/routes';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';

export default function AuthTabs({ route }: { route: string }) {
  const navigate = useNavigate();
  return (
    <Card className="max-w-full w-[340px] h-[400px]">
      <CardBody className="overflow-hidden">
        <Tabs
          fullWidth
          size="md"
          aria-label="Tabs form"
          selectedKey={route}
          onSelectionChange={(key) => navigate(key as string)}
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
