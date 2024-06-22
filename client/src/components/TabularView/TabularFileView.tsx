/* eslint-disable no-magic-numbers */
/* eslint-disable function-paren-newline */
/* eslint-disable no-nested-ternary */
import { useNavigate } from 'react-router-dom';
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
  Breadcrumbs,
  BreadcrumbItem,
} from '@nextui-org/react';
import { FaEllipsisVertical, FaRegFilePdf } from 'react-icons/fa6';
import { MdDelete, MdOutlineRefresh } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';
import { GoBookmarkSlash } from 'react-icons/go';
import { TbPinned } from 'react-icons/tb';
import { deleteFileObj, getFilesDataObj } from '@/utils/axiosReqObjects';
import { IAction, IBookmarkFile } from '@/types/folder';
import { useAuth } from '@/hooks/useAuth';
import { parseUTC } from '@/utils/helpers';
import {
  bookmarkFileColumns,
  uploadFileColumns,
  monthNames,
} from '@/constants/shared';
import { CLIENT_ROUTES } from '@/constants/routes';
import { removeBookmarkObj } from '@/utils/axiosReqObjects/bookmarks';
import fetcher from '@/utils/fetcher/fetcher';
import RenderItems from '../Pagination/RenderItems';

const statusColorMap: Record<string, ChipProps['color']> = {
  Uploaded: 'success',
  Failed: 'danger',
  Processing: 'warning',
};

export default function TabularFileView({
  actionVarient,
}: {
  actionVarient: IAction;
}) {
  const {
    authState: { jwtToken },
  } = useAuth();

  const urlParts = window.location.href.split('/');
  const folderInfo = urlParts.pop() ?? '';
  const getFolderInfo = (info: string) => {
    const [folderId, folderName] = info.split('_');
    return [folderId, decodeURIComponent(folderName)];
  };
  const [folderId, folderName] = getFolderInfo(folderInfo);

  const {
    data: response,
    isLoading,
    mutate,
    isValidating,
  } = useSWR(
    folderId
      ? getFilesDataObj({ action: actionVarient, parentId: folderId }, jwtToken)
      : null
  );

  const files: Array<IBookmarkFile> = response?.data.files ?? [];

  const isBookmark = actionVarient === 'BOOKMARK';
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
  const [page, setPage] = useState<number>(1);
  const columns = isBookmark ? bookmarkFileColumns : uploadFileColumns;

  const hasSearchFilter = Boolean(filterValue);
  const ROWS_PER_PAGE = 10;

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

  const pages = Math.max(Math.ceil(filteredItems.length / ROWS_PER_PAGE), 0);

  const handleDelete = useCallback(
    async (fileId: string, questionId: string) => {
      const reqObj = isBookmark
        ? removeBookmarkObj({ fileId, folderId: folderId! }, jwtToken)
        : deleteFileObj(questionId, jwtToken);
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
    },
    []
  );

  const sortedItems = useMemo(
    () =>
      [...filteredItems].sort((a: IBookmarkFile, b: IBookmarkFile) => {
        const first = a[sortDescriptor.column as keyof IBookmarkFile] as string;
        const second = b[
          sortDescriptor.column as keyof IBookmarkFile
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

  const renderCell = useCallback((file: IBookmarkFile, columnKey: Key) => {
    const cellValue = file[columnKey as keyof IBookmarkFile];
    const { day, month, year } = parseUTC(cellValue as string);
    const [heading, code, semester, examYear] =
      columnKey === 'filename' ? cellValue!.split(',') : [];

    switch (columnKey) {
      case 'filename':
        return (
          <div className="flex flex-row gap-x-2 cursor-pointer">
            <FaRegFilePdf className="self-center text-4xl text-[#e81a0c]" />
            <span className="flex flex-col">
              <span className="font-semibold text-sm min-w-[120px]">
                {heading} {isBookmark && <span>({code})</span>}
              </span>
              {isBookmark && (
                <span className="text-sm opacity-60">
                  {semester}, {examYear}
                </span>
              )}
            </span>
          </div>
        );
      case 'createdAt':
        return (
          <div className="font-medium opacity-65">
            {monthNames[month]} {day}, {year}
          </div>
        );
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[file.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
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
              <DropdownMenu aria-label="Static Actions" variant="light">
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={
                    isBookmark ? (
                      <GoBookmarkSlash className="text-xl" />
                    ) : (
                      <MdDelete className="text-xl" />
                    )
                  }
                  onClick={() => handleDelete(file.fileId, file.questionId)}
                >
                  {isBookmark ? 'Remove bookmark' : 'Delete Post'}
                </DropdownItem>
                {isBookmark ? (
                  <DropdownItem
                    key="pinned"
                    startContent={<TbPinned className="text-xl" />}
                    onClick={() => handleDelete(file.fileId, file.questionId)}
                  >
                    Pin File
                  </DropdownItem>
                ) : (
                  (null as any)
                )}
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
      <>
        <div className="flex flex-row justify-between gap-x-2">
          <Input
            isClearable
            radius="full"
            className="w-full sm:max-w-[32%]"
            placeholder="Search by file name"
            startContent={<IoSearch className="text-xl" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <Button
            color="secondary"
            variant="bordered"
            startContent={<MdOutlineRefresh className="text-xl" />}
            radius="sm"
            onClick={() => mutate()}
          >
            Refresh
          </Button>
        </div>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem onClick={() => navigate(-1)}>
            {folderName}
          </BreadcrumbItem>
          <BreadcrumbItem href="#">Files</BreadcrumbItem>
        </Breadcrumbs>
      </>
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
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={pages >= 1 ? bottomContent : null}
      bottomContentPlacement="outside"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      selectionMode="single"
      onRowAction={(key) => navigate(`${CLIENT_ROUTES.FILE_PREVIEW}/${key}`)}
      radius="sm"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
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
        emptyContent="No files found"
        items={items}
        isLoading={isLoading || isValidating}
        loadingContent={<Spinner />}
      >
        {(item) => (
          <TableRow key={item.questionId}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
