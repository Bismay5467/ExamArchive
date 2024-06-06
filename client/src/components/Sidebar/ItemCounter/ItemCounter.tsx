import { FaChevronRight } from 'react-icons/fa';

export const ItemCounter = ({ number }: { number: number }) => (
  <div className="flex items-center gap-1 text-default-400">
    <span className="text-small">{number}</span>
    <FaChevronRight className="text-xl" />
  </div>
);
