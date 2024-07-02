/* eslint-disable no-underscore-dangle */
/* eslint-disable no-magic-numbers */

/* eslint-disable no-nested-ternary */
import { Key, useCallback, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  SortDescriptor,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ChipProps,
  Chip,
  Spinner,
} from '@nextui-org/react';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { viewReportsObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import { IReportPreview } from '@/types/report';
import { ModerationEntryColumns } from '@/constants/moderation';
import { parseUTC } from '@/utils/helpers';
import { monthNames } from '@/constants/shared';

const contentColorMap: Record<string, ChipProps['color']> = {
  Comment: 'success',
  Post: 'secondary',
};

export default function TabularView() {
  const {
    authState: { jwtToken },
  } = useAuth();

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.data.hasMore) return null;
    return viewReportsObj((pageIndex + 1).toString(), jwtToken);
  };
  const { data: response, isLoading, isValidating } = useSWRInfinite(getKey);
  const reportData = response ? [...response] : [];
  const reducedReportData = reportData
    .map(({ data }) => data)
    .map(({ data }) => data.result);

  const reportList: Array<IReportPreview> | undefined = reducedReportData
    ? [].concat(...reducedReportData)
    : [];

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});

  // const handleDelete = useCallback(async (moderator: IModerator) => {
  //   const reqObj = removeModeratorObj(moderator, jwtToken);
  //   if (!reqObj) {
  //     toast.error('Something went wrong!', {
  //       duration: 5000,
  //     });
  //     return;
  //   }

  //   try {
  //     await fetcher(reqObj);
  //   } catch (err) {
  //     toast.error('Something went wrong!', {
  //       description: `${err}`,
  //       duration: 5000,
  //     });
  //     return;
  //   }
  //   mutate().then(() =>
  //     toast.success(
  //       `${isAdmin ? 'Admin' : 'Super-Admin'} previlage removed successfully!`,
  //       {
  //         duration: 5000,
  //       }
  //     )
  //   );
  // }, []);

  const sortedItems = useMemo(
    () =>
      [...reportList].sort((a: IReportPreview, b: IReportPreview) => {
        const first = a[
          sortDescriptor.column as keyof IReportPreview
        ] as string;
        const second = b[
          sortDescriptor.column as keyof IReportPreview
        ] as string;

        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      }),
    [sortDescriptor, response]
  );

  const renderCell = useCallback((report: IReportPreview, columnKey: Key) => {
    const cellValue = report[columnKey as keyof IReportPreview];
    const { day, month, year } = parseUTC(cellValue as string);

    switch (columnKey) {
      case 'docModel':
        return (
          <div className="">
            <Chip
              className="capitalize"
              color={contentColorMap[report.docModel]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          </div>
        );
      case 'totalReport':
        return <div>{cellValue}</div>;
      case 'reasons':
        return <div>{(cellValue as string[]).at(0)}</div>;
      case 'createdAt':
        return (
          <div className="">
            {monthNames[month]} {day}, {year}
          </div>
        );
      default:
        return (
          <div className="font-medium flex flex-row justify-between opacity-65">
            <span className="self-center">
              {monthNames[month]} {day}, {year}
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
                >
                  Mark as resolved
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
    }
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto bg-white min-h-[1000px] p-4">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        sortDescriptor={sortDescriptor}
        selectionMode="single"
        radius="sm"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={ModerationEntryColumns}>
          {({ name, uid, sortable }) => (
            <TableColumn key={uid} allowsSorting={sortable}>
              {name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No files found"
          items={sortedItems}
          isLoading={isLoading || isValidating}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
