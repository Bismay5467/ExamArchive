import Planing from '@/assets/Planning.svg';
import Progamming from '@/assets/Programing.svg';
import VersionUpgrade from '@/assets/Version.svg';
import { cn } from '@/lib/utils';

export default function CommingSoon({
  className,
  varient,
}: {
  className: string | undefined;
  varient: 'planning' | 'versionUpgrade' | 'programming';
}) {
  const getSvg = () => {
    switch (varient) {
      case 'planning':
        return Planing;
      case 'versionUpgrade':
        return VersionUpgrade;
      case 'programming':
        return Progamming;
      default:
        return '';
    }
  };

  const getHeading = () => {
    switch (varient) {
      case 'planning':
        return 'Under construction!';
      case 'versionUpgrade':
        return 'Woo Hoo! almost there!';
      case 'programming':
        return 'Implementing now!';
      default:
        return '';
    }
  };

  const getTag = () => {
    switch (varient) {
      case 'planning':
        return '*Expect a this new feature soon enough!';
      case 'versionUpgrade':
        return '*We currently in the devops phase, expect roll out any-time now!';
      case 'programming':
        return '*Feature is getting implemeneted by Brains and Caffeine. Reach out to admin for more information!';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn('relative flex flex-col items-center gap-y-4', className)}
    >
      <img src={getSvg()} alt="" className="w-[90%]" />
      <div>
        <h1 className="text-6xl font-bold opacity-80 mb-4">{getHeading()}</h1>
        <h3 className="text-md opacity-60">{getTag()}</h3>
      </div>
    </div>
  );
}
