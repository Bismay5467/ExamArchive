import SuccessTick from '@/assets/SuccessTick.svg';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react';

export default function FinalSubmit() {
  return (
    <section className="flex flex-col items-center p-6">
      <h1 className="text-7xl font-semibold text-gray-400">Amazing Job!</h1>
      <img src={SuccessTick} alt="" />
      {/* TODO: Save current progress in local storage */}
      <Popover placement="right" showArrow={true}>
        <PopoverTrigger>
          <Button>Submit another one?</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="text-small font-bold py-2 px-4">Comming Soon 🙂</div>
        </PopoverContent>
      </Popover>
    </section>
  );
}
