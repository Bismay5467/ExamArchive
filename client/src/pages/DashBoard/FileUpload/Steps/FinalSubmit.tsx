import { Button } from '@nextui-org/button';
import SuccessTick from '@/assets/SuccessTick.svg';

export default function FinalSubmit() {
  return (
    <section className="flex flex-col items-center p-6">
      <h1 className="text-7xl font-semibold text-gray-400">Amazing Job!</h1>
      <img src={SuccessTick} alt="" />
      <Button color="primary" isDisabled>
        Submit Another one
      </Button>
    </section>
  );
}
