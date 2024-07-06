import { Chip, SlotsToClasses } from '@nextui-org/react';

export default function Tag({
  val,
  classNames,
  className,
  handleDeleteTag,
}: {
  val: string;
  classNames?: SlotsToClasses<
    'base' | 'content' | 'dot' | 'avatar' | 'closeButton'
  >;
  className?: string;
  handleDeleteTag?: (_val: string) => void;
}) {
  return (
    <Chip
      classNames={classNames}
      className={className}
      {...(handleDeleteTag && { onClose: () => handleDeleteTag(val) })}
    >
      {val.toLowerCase()}
    </Chip>
  );
}
