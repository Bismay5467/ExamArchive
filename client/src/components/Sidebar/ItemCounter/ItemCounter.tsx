import { FaChevronRight } from 'react-icons/fa';

export default function ItemCounter({ number }: { number: number }) {
  return (
    <div className="flex items-center gap-1 text-default-400">
      <span className="text-small">{number}</span>
      <FaChevronRight className="text-xl" />
    </div>
  );
}
