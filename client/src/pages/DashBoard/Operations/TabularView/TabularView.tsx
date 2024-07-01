/* eslint-disable no-magic-numbers */
/* eslint-disable function-paren-newline */
/* eslint-disable no-nested-ternary */
import useSWR from 'swr';
import { toast } from 'sonner';
import { Key, useCallback, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  SortDescriptor,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ChipProps,
  Chip,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { IoSearch, IoPersonAddOutline } from 'react-icons/io5';
import { getModeratorsObj, removeModeratorObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import fetcher from '@/utils/fetcher/fetcher';
import RenderItems from '@/components/Pagination/RenderItems';
import {
  IMderatorDetails,
  IModerator,
  TModeratorRole,
} from '@/types/superadmin';
import { OperationsEntryColumns } from '@/constants/operations';
import InviteModal from './InviteModal/InviteModal';

const statusColorMap: Record<string, ChipProps['color']> = {
  ACCEPTED: 'success',
  PENDING: 'warning',
};

export default function TabularView({ varient }: { varient: TModeratorRole }) {
  const {
    authState: { jwtToken },
  } = useAuth();

  const {
    data: response,
    isLoading,
    mutate,
    isValidating,
  } = useSWR(getModeratorsObj({ role: varient }, jwtToken));
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const userData: Array<IMderatorDetails> = response?.data.data ?? [];
  const isAdmin = varient === 'ADMIN';

  const [filterValue, setFilterValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
  const [page, setPage] = useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);
  const ROWS_PER_PAGE = 10;

  const filteredItems = useMemo(() => {
    let filteredUser = [...userData];

    if (hasSearchFilter) {
      filteredUser = filteredUser.filter((file) =>
        file.username
          .toLowerCase()
          .split(',')
          .join('')
          .includes(filterValue.toLowerCase())
      );
    }

    return filteredUser;
  }, [response, filterValue]);

  const pages = Math.max(Math.ceil(filteredItems.length / ROWS_PER_PAGE), 0);

  const handleDelete = useCallback(async (moderator: IModerator) => {
    const reqObj = removeModeratorObj(moderator, jwtToken);
    if (!reqObj) {
      toast.error('Something went wrong!', {
        duration: 5000,
      });
      return;
    }

    try {
      await fetcher(reqObj);
    } catch (err) {
      toast.error('Something went wrong!', {
        description: `${err}`,
        duration: 5000,
      });
      return;
    }
    mutate().then(() =>
      toast.success(
        `${isAdmin ? 'Admin' : 'Super-Admin'} previlage removed successfully!`,
        {
          duration: 5000,
        }
      )
    );
  }, []);

  const sortedItems = useMemo(
    () =>
      [...filteredItems].sort((a: IMderatorDetails, b: IMderatorDetails) => {
        const first = a[
          sortDescriptor.column as keyof IMderatorDetails
        ] as string;
        const second = b[
          sortDescriptor.column as keyof IMderatorDetails
        ] as string;

        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      }),
    [sortDescriptor, filteredItems, response]
  );

  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, ROWS_PER_PAGE]);

  const renderCell = useCallback(
    (moderator: IMderatorDetails, columnKey: Key) => {
      const cellValue = moderator[columnKey as keyof IMderatorDetails];

      switch (columnKey) {
        case 'username':
          return <div className="">{cellValue}</div>;
        case 'email':
          return <div className="">{cellValue}</div>;
        default:
          return (
            <div className="font-medium flex flex-row justify-between opacity-65">
              <span className="self-center">
                <Chip
                  color={statusColorMap[moderator.invitationStatus]}
                  size="sm"
                  variant="flat"
                >
                  {cellValue}
                </Chip>
              </span>
              <Dropdown radius="sm">
                <DropdownTrigger>
                  <Button
                    variant="light"
                    size="sm"
                    isIconOnly
                    className="self-center"
                  >
                    <FaEllipsisVertical className="text-lg" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions" variant="light">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<MdDelete className="text-xl" />}
                    onClick={() =>
                      handleDelete({
                        email: moderator.email,
                        username: moderator.username,
                        role: varient,
                      })
                    }
                  >
                    Remove
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
      }
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = useMemo(
    () => (
      <div className="flex flex-row justify-between gap-x-2">
        <Input
          isClearable
          radius="full"
          className="w-full sm:max-w-[32%]"
          placeholder="Search by username"
          startContent={<IoSearch className="text-xl" />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <Button
          color="secondary"
          variant="bordered"
          startContent={<IoPersonAddOutline className="text-lg" />}
          radius="sm"
          onPress={onOpen}
        >
          Invite
        </Button>
      </div>
    ),
    [filterValue, onSearchChange, hasSearchFilter]
  );

  const bottomContent = useMemo(
    () => (
      <div className="py-10 px-2 flex flex-row justify-end">
        <Pagination
          disableCursorAnimation
          showControls
          total={pages}
          initialPage={1}
          className="gap-2"
          radius="full"
          renderItem={RenderItems}
          variant="light"
        />
      </div>
    ),
    [items.length, page, pages, hasSearchFilter]
  );

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={pages >= 1 ? bottomContent : null}
        bottomContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        selectionMode="single"
        radius="sm"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={OperationsEntryColumns}>
          {({ name, uid, sortable }) => (
            <TableColumn key={uid} allowsSorting={sortable}>
              {name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No files found"
          items={items}
          isLoading={isLoading || isValidating}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item.userId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <InviteModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        role={varient}
      />
    </>
  );
}
