import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@nextui-org/react';
import { FaSun } from 'react-icons/fa';
import { FaMoon } from 'react-icons/fa';

export default function ModeToggle() {
  // TODO: This needs refactoring!
  const { setTheme, theme } = useTheme();

  const changeTheme = (e: boolean) => {
    if (e) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const getInitialTheme = () => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      return systemTheme === 'light';
    }

    return theme === 'light';
  };

  return (
    <Switch
      defaultSelected={getInitialTheme()}
      size="lg"
      color="success"
      startContent={<FaSun />}
      endContent={<FaMoon />}
      onValueChange={changeTheme}
    />
  );
}
