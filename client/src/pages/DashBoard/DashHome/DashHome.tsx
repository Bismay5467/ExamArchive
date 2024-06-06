import CommingSoon from '@/components/CommingSoon/CommingSoon';

export default function DashHome() {
  return (
    <div className="flex flex-row justify-center">
      <CommingSoon className="w-[800px]" varient={'planning'} />
    </div>
  );
}
