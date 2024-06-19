/* eslint-disable function-paren-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
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
} from '@nextui-org/react';
import { Key, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaFolderOpen } from 'react-icons/fa';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { MdCreateNewFolder } from 'react-icons/md';
import { folderColumns, monthNames } from '@/constants/shared';
import { IBookmarkFolder } from '@/types/folder';
import { deleteFolderObj, getFilesDataObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import { parseUTC } from '@/utils/helpers';
import fetcher from '@/utils/fetcher/fetcher';

export default function App() {
  const {
    authState: { jwtToken },
  } = useAuth();
  const { data: response, mutate } = useSWR(
    getFilesDataObj({ action: 'BOOKMARK', page: '1', parentId: '' }, jwtToken)
  );

  const navigate = useNavigate();
  const folders: Array<IBookmarkFolder> = response?.data.files ?? [];

  const [filterValue, setFilterValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
  const [page, setPage] = useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);
  const rowsPerPage = 10;

  const filteredItems = useMemo(() => {
    let filteredUsers = [...folders];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [response, filterValue]);

  const pages = Math.max(Math.ceil(filteredItems.length / rowsPerPage), 1);

  const handleDelete = useCallback(async (folderId: string) => {
    const reqObj = deleteFolderObj({ action: 'BOOKMARK', folderId }, jwtToken);
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
      toast.success('Foder deleted successfully!', {
        duration: 5000,
      })
    );
  }, []);

  const sortedItems = useMemo(
    () =>
      [...filteredItems].sort((a: IBookmarkFolder, b: IBookmarkFolder) => {
        const first = a[
          sortDescriptor.column as keyof IBookmarkFolder
        ] as number;
        const second = b[
          sortDescriptor.column as keyof IBookmarkFolder
        ] as number;
        // eslint-disable-next-line no-magic-numbers
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      }),
    [sortDescriptor, filteredItems, response]
  );

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const renderCell = useCallback((folder: IBookmarkFolder, columnKey: Key) => {
    const cellValue = folder[columnKey as keyof IBookmarkFolder];
    const { day, month, year } = parseUTC(cellValue as string);

    switch (columnKey) {
      case 'name':
        return (
          <div className="flex flex-row gap-x-2 cursor-pointer">
            <FaFolderOpen className="self-center text-4xl text-blue-500" />
            <span className="flex flex-col">
              <span className="font-medium text-sm min-w-[120px]">
                {cellValue}
              </span>
              <span className="text-sm opacity-60">
                File Count: {folder.noOfFiles}
              </span>
            </span>
          </div>
        );
      case 'createdAt':
        return (
          <div className="font-medium opacity-65">
            {monthNames[month]} {day}, {year}
          </div>
        );
      default:
        return (
          <div className="font-medium flex flex-row justify-between opacity-65">
            <span className="self-center">
              {monthNames[month]} {day}, {year}
            </span>
            <Dropdown>
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
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="copy"
                  onClick={() => navigate(`${folder._id}`)}
                >
                  Open
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={() => handleDelete(folder._id)}
                >
                  Delete folder
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
    }
  }, []);

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
      <div className="flex flex-row gap-x-2">
        <Input
          isClearable
          radius="sm"
          className="w-full sm:max-w-[44%]"
          placeholder="Search by folder name..."
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <Button
          color="primary"
          endContent={<MdCreateNewFolder className="text-xl" />}
          radius="sm"
        >
          Create new
        </Button>
      </div>
    ),
    [filterValue, onSearchChange, hasSearchFilter]
  );

  const bottomContent = useMemo(
    () => (
      <div className="py-2 px-2 flex flex-row justify-end">
        <Pagination
          radius="sm"
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    ),
    [items.length, page, pages, hasSearchFilter]
  );

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      selectionMode="single"
      onRowAction={(key) => navigate(`${key}`)}
      radius="sm"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={folderColumns}>
        {({ name, uid, sortable }) => (
          <TableColumn
            key={uid}
            allowsSorting={sortable}
            align={uid === 'createdAt' ? 'end' : 'start'}
          >
            {name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="No users found" items={items}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
