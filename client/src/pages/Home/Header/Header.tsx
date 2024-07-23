import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { CLIENT_ROUTES } from '@/constants/routes';
import Logo from '@/assets/logo-dark-no-bg.png';
import { useAuth } from '@/hooks/useAuth';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import ModeToggle from '@/components/ModeToggle';
import quickLinks from '@/constants/quickLinks';

export default function Header() {
  const navigate = useNavigate();
  const {
    authState: { isAuth, role, userId },
  } = useAuth();
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link
              to={CLIENT_ROUTES.HOME}
              className="block"
              aria-label="Exam-Archive"
            >
              <img src={Logo} alt="banner" className="w-[300px]" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="flex grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li className="mr-12 hidden flex-row gap-x-8 text-base opacity-70 sm:flex">
                {quickLinks(role, userId!).map(({ key, link }) => (
                  <Link to={link} key={key} className="hover:underline">
                    {key}
                  </Link>
                ))}
              </li>
              {isAuth ? (
                <li className="flex flex-row gap-x-2">
                  <UserAvatar />
                  <ModeToggle className="hover:cursor-pointer self-center" />
                </li>
              ) : (
                <>
                  <li>
                    <Button
                      color="primary"
                      radius="sm"
                      variant="light"
                      onPress={() => {
                        navigate(CLIENT_ROUTES.AUTH_LOGIN);
                      }}
                    >
                      Sign in
                    </Button>
                  </li>
                  <li>
                    <Button
                      color="primary"
                      radius="sm"
                      variant="bordered"
                      onPress={() => {
                        navigate(CLIENT_ROUTES.AUTH_SIGNUP);
                      }}
                    >
                      Sign Up
                    </Button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
