import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { IDropDownProps } from '@/types/comments';

export default function CustomDropDown({ menu }: { menu: IDropDownProps[] }) {
  return (
    <Dropdown className="font-natosans" radius="sm">
      <DropdownTrigger>
        <Button variant="light" size="sm" isIconOnly className="self-center">
          <FaEllipsisVertical className="text-lg" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        variant="light"
        className="text-slate-700"
      >
        {
          menu.map(({ icon, value, action, itemClassName }, idx) => (
            <DropdownItem
              key={idx}
              startContent={icon}
              onClick={action}
              className={itemClassName ?? ''}
            >
              {value}
            </DropdownItem>
          )) as any
        }
      </DropdownMenu>
    </Dropdown>
  );
}
