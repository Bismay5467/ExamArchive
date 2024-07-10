/* eslint-disable indent */
/* eslint-disable no-confusing-arrow */
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
import { FaEllipsisVertical } from 'react-icons/fa6';
import { MdOutlineRefresh } from 'react-icons/md';
import {
  RiDeleteBin6Line,
  RiErrorWarningLine,
  RiPushpinLine,
} from 'react-icons/ri';
import { IoSearch } from 'react-icons/io5';
import { GoBookmarkSlash } from 'react-icons/go';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { AiOutlineFilePdf } from 'react-icons/ai';
import {
  deleteFileObj,
  getFilesDataObj,
  togglePinObj,
} from '@/utils/axiosReqObjects';
import { TAction, TFileType } from '@/types/folder';
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
import { usePin } from '@/pages/DashBoard/Bookmarks/Bookmarks';

const statusMap: Record<string, Record<string, any>> = {
  Uploaded: {
    color: 'success',
    icon: <IoIosCheckmarkCircleOutline className="text-xl mr-1" />,
  },
  Failed: {
    color: 'danger',
    icon: <RiErrorWarningLine className="text-xl mr-1" />,
  },
  Processing: {
    color: 'default',
    icon: <Spinner size="sm" color="default" className="mr-1" />,
  },
};

export default function TabularFileView({
  actionVarient,
}: {
  actionVarient: TAction;
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

  const { pinnedFiles, mutate: mutatePin } = usePin();

  const files: Array<TFileType<typeof actionVarient>> =
    response?.data?.files ?? [];

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
  }, [response, filterValue, pinnedFiles]);

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
        isBookmark
          ? toast.success('Bookmark removed successfully!', {
              duration: 5000,
            })
          : toast.success('File removed successfully!', {
              duration: 5000,
            })
      );
    },
    []
  );

  const handleFilePin = useCallback(
    async (fileId: string, questionId: string, action: 'PIN' | 'UNPIN') => {
      const isFilePinned =
        action === 'PIN' &&
        pinnedFiles.some((file) => file.questionId === questionId);
      if (isFilePinned) {
        toast.error('This file is already pinned!', {
          duration: 5000,
        });
        return;
      }
      const reqObj = togglePinObj({ fileId, action }, jwtToken);
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
      await mutatePin();
      mutate().then(() =>
        toast.success(
          `File ${action === 'PIN' ? 'Pinned' : 'Un-Pinned'} successfully!`,
          {
            duration: 5000,
          }
        )
      );
    },
    [pinnedFiles]
  );

  const iconClasses = 'text-xl pointer-events-none flex-shrink-0';

  const sortedItems = useMemo(
    () =>
      [...filteredItems].sort(
        (
          a: TFileType<typeof actionVarient>,
          b: TFileType<typeof actionVarient>
        ) => {
          const first = a[
            sortDescriptor.column as keyof TFileType<typeof actionVarient>
          ] as string;
          const second = b[
            sortDescriptor.column as keyof TFileType<typeof actionVarient>
          ] as string;

          const cmp = first < second ? -1 : first > second ? 1 : 0;

          return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        }
      ),
    [sortDescriptor, filteredItems, response]
  );

  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, ROWS_PER_PAGE]);

  const renderCell = useCallback(
    (file: TFileType<typeof actionVarient>, columnKey: Key) => {
      const cellValue =
        file[columnKey as keyof TFileType<typeof actionVarient>];
      const { day, month, year } = parseUTC(cellValue as string);
      const [heading, code, semester, examYear] =
        columnKey === 'filename' ? (cellValue as string)!.split(',') : [];

      switch (columnKey) {
        case 'filename':
          return (
            <div className="flex min-w-[300px] flex-row gap-x-2 cursor-pointer">
              <AiOutlineFilePdf className="text-3xl text-[#e81a0c]" />
              <span className="flex flex-col">
                <span className="text-sm min-w-[120px]">
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
            <div className="min-w-[100px] font-medium opacity-65">
              {monthNames[month]} {day}, {year}
            </div>
          );
        case 'status':
          return (
            <Chip
              className="uppercase min-w-[100px] border border-transparent"
              color={
                statusMap[(file as TFileType<'UPLOAD'>).status]
                  .color as ChipProps['color']
              }
              size="sm"
              variant="bordered"
              startContent={
                statusMap[(file as TFileType<'UPLOAD'>).status].icon
              }
            >
              {cellValue}
            </Chip>
          );
        default:
          return (
            <div className="min-w-[120px] font-medium flex flex-row justify-between opacity-65">
              <span className="self-center">
                {monthNames[month]} {day}, {year}
              </span>
              <Dropdown radius="sm" className="font-natosans">
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
                    startContent={
                      isBookmark ? (
                        <GoBookmarkSlash className={iconClasses} />
                      ) : (
                        <RiDeleteBin6Line className={iconClasses} />
                      )
                    }
                    onClick={() => handleDelete(file.fileId, file.questionId)}
                  >
                    {isBookmark ? 'Remove Bookmark' : 'Delete Post'}
                  </DropdownItem>
                  {isBookmark ? (
                    <DropdownItem
                      key="pinned"
                      startContent={<RiPushpinLine className={iconClasses} />}
                      onClick={() =>
                        handleFilePin(
                          file.fileId,
                          file.questionId,
                          (file as TFileType<'BOOKMARK'>).isPinned
                            ? 'UNPIN'
                            : 'PIN'
                        )
                      }
                    >
                      {(file as TFileType<'BOOKMARK'>).isPinned
                        ? 'Un-Pin File'
                        : 'Pin File'}
                    </DropdownItem>
                  ) : (
                    (null as any)
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
      }
    },
    [pinnedFiles, items]
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
      <>
        <div className="flex flex-row justify-between gap-x-2 mt-3 font-natosans">
          <Input
            isClearable
            radius="full"
            className="w-full sm:max-w-[32%]"
            placeholder="Search by file name"
            startContent={<IoSearch className="text-xl" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            variant="bordered"
          />
          <Button
            color="primary"
            variant="bordered"
            startContent={<MdOutlineRefresh className="text-xl" />}
            radius="sm"
            onClick={() => mutate()}
          >
            Refresh
          </Button>
        </div>
        <Breadcrumbs className="my-3">
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
      className="font-natosans"
    >
      <TableHeader columns={columns}>
        {({ name, uid, sortable }) => (
          <TableColumn
            key={uid}
            allowsSorting={sortable}
            {...(uid === 'status' && {
              className: 'pl-10',
            })}
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
