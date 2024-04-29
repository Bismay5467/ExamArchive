import React from 'react';
import Logo from '../../assets/Logo.png';
import { ModeToggle } from '../ModeToggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';

const Navbar = () => {
  return (
    <nav>
      <div className="max-w-[1280px] mx-auto py-2 flex flex-row justify-between">
        <div className="flex flex-row gap-x-4 items-center">
          <img src={Logo} alt="Logo" className="w-[200px]" />
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item Three</NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Input type="email" placeholder="Search" className="w-[300px]" />
        </div>
        <div className="flex flex-row gap-x-4 items-center">
          <Button className="rounded-3xl">Log in</Button>
          <Button className="rounded-3xl">Sign up</Button>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
