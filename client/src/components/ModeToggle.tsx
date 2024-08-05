/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FaMoon } from 'react-icons/fa';
import { MdSunny } from 'react-icons/md';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import IconWrapper from './Sidebar/NavCard/IconWrapper/IconWrapper';
import { THEME } from '@/constants/shared';

export default function ModeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  const changeTheme = () => {
    if (theme === THEME.LIGHT) setTheme(THEME.DARK);
    else setTheme(THEME.LIGHT);
  };

  useEffect(() => {
    if (theme === THEME.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      setTheme(systemTheme);
    } else setTheme(theme);
  }, []);

  return (
    <div onClick={changeTheme} className={className}>
      <IconWrapper className="self-center">
        {theme === THEME.LIGHT ? (
          <MdSunny className="text-2xl" />
        ) : (
          <FaMoon className="text-xl" />
        )}
      </IconWrapper>
    </div>
  );
}
