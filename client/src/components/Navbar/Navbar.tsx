import Logo from '../../assets/Logo.png';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '../ui/button.tsx';
import ModeToggle from '../ModeToggle.tsx';

export default function Navbar() {
  return (
    <nav>
      <div className="max-w-[1280px] mx-auto py-2 flex flex-row justify-between">
        <div className="flex flex-row gap-x-4 items-center">
          <img src={Logo} alt="Logo" className="w-[200px]" />
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
}
