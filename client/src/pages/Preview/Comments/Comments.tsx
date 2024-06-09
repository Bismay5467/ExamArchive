import CommingSoon from '@/components/CommingSoon/CommingSoon';

export default function Comments() {
  return (
    <div className="mt-8">
      <h1 className="text-5xl text-center font-semibold opacity-60">
        ≤Comment Section≥
      </h1>
      <CommingSoon className="w-[50%] mx-auto mt-4" varient="planning" />
    </div>
  );
}
