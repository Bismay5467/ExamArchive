import { FilterInputs } from '@/types';
import { UseFormRegister } from 'react-hook-form';

export default function FilterForm({
  register,
}: {
  register: UseFormRegister<FilterInputs>;
}) {
  return (
    <div>
      <input type="checkbox" />
    </div>
  );
}
