/* eslint-disable function-paren-newline */
/* eslint-disable no-nested-ternary */
import { useNavigate, useParams } from 'react-router-dom';
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
} from '@nextui-org/react';
import { FaEllipsisVertical, FaRegFilePdf } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';
import { getFilesDataObj } from '@/utils/axiosReqObjects';
import { IAction, IBookmarkFile } from '@/types/folder';
import { useAuth } from '@/hooks/useAuth';
import { parseUTC } from '@/utils/helpers';
import { fileColumns, monthNames } from '@/constants/shared';
import { TableViewSkeleton } from '../Skeleton';
import { CLIENT_ROUTES } from '@/constants/routes';
import { removeBookmarkObj } from '@/utils/axiosReqObjects/bookmarks';
import fetcher from '@/utils/fetcher/fetcher';

export default function TabularFileView({
  actionVarient,
}: {
  actionVarient: IAction;
}) {
  const { folderId } = useParams();
  const {
    authState: { jwtToken },
  } = useAuth();

  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR(
    folderId
      ? getFilesDataObj({ action: actionVarient, parentId: folderId }, jwtToken)
      : null
  );

  const files: Array<IBookmarkFile> = response?.data.files ?? [];

  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
  const [page, setPage] = useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);
  const rowsPerPage = 10;

  const filteredItems = useMemo(() => {
    let filteredFiles = [...files];

    if (hasSearchFilter) {
      filteredFiles = filteredFiles.filter((file) =>
        file.filename
          .toLowerCase()
          .split(',')
          .join('')
          .includes(filterValue.toLowerCase())
      );
    }

    return filteredFiles;
  }, [response, filterValue]);

  const pages = Math.max(Math.ceil(filteredItems.length / rowsPerPage), 1);

  const handleRemove = useCallback(async (fileId: string) => {
    const reqObj = removeBookmarkObj({ fileId, folderId: folderId! }, jwtToken);
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
      toast.success('Bookmark removed successfully!', {
        duration: 5000,
      })
    );
  }, []);

  const sortedItems = useMemo(
    () =>
      [...filteredItems].sort((a: IBookmarkFile, b: IBookmarkFile) => {
        const first = a[sortDescriptor.column as keyof IBookmarkFile] as string;
        const second = b[
          sortDescriptor.column as keyof IBookmarkFile
        ] as string;
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

  const renderCell = useCallback((file: IBookmarkFile, columnKey: Key) => {
    const cellValue = file[columnKey as keyof IBookmarkFile];
    const { day, month, year } = parseUTC(cellValue as string);
    const [heading, code, semester, examYear] =
      columnKey === 'filename' ? cellValue!.split(',') : [];

    switch (columnKey) {
      case 'filename':
        return (
          <div className="flex flex-row gap-x-2 cursor-pointer">
            <FaRegFilePdf className="self-center text-4xl text-blue-500" />
            <span className="flex flex-col">
              <span className="font-semibold text-sm min-w-[120px]">
                {heading} ({code})
              </span>
              <span className="text-sm opacity-60">
                {semester}, {examYear}
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
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<MdDelete className="text-xl" />}
                  onClick={() => handleRemove(file.fileId)}
                >
                  Remove Bookmark
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
      <div className="flex flex-row justify-between gap-x-2">
        <Input
          isClearable
          radius="sm"
          className="w-full sm:max-w-[44%]"
          placeholder="Search by file name..."
          startContent={<IoSearch className="text-xl" />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
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
      onRowAction={(key) => navigate(`${CLIENT_ROUTES.FILE_PREVIEW}/${key}`)}
      radius="sm"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={fileColumns}>
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
      <TableBody
        emptyContent="No folders found"
        items={items}
        isLoading={isLoading}
        loadingContent={<TableViewSkeleton />}
      >
        {(item) => (
          <TableRow key={item.fileId}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
