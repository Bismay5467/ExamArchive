import { pdfjs, Document, Page } from 'react-pdf';
import { useState } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { INITIAL_PAGE_NUMBER } from '@/constants/shared';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export function PDFViewer({ pdfURL }: { pdfURL: string }) {
  const [totalPages, setTotalPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(INITIAL_PAGE_NUMBER);
  const isLastPage = totalPages === pageNumber;
  const isFirstPage = pageNumber === INITIAL_PAGE_NUMBER;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setTotalPages(numPages);
  };

  return (
    <div className="flex flex-row justify-start">
      <div
        aria-label="canvas"
        className="relative  rounded-xl shadow-lg overflow-hidden"
      >
        <Document file={pdfURL} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
        <div className="absolute flex flex-row gap-x-4 rounded-xl bottom-4 left-[32%] bg-white overflow-hidden drop-shadow-2xl">
          <button
            className="self-stretch min-w-[50px] flex flex-row justify-center items-center disabled:hover:bg-white disabled:opacity-30 hover:bg-slate-300"
            disabled={isFirstPage}
            onClick={() => setPageNumber((prev) => prev - 1)}
            aria-label="previous butuon"
            type="button"
          >
            <FaChevronLeft />
          </button>
          <span className="self-center py-4 font-semibold">
            Page {pageNumber} of {totalPages}
          </span>
          <button
            className="self-stretch min-w-[50px] flex flex-row justify-center items-center disabled:hover:bg-white disabled:opacity-30 hover:bg-slate-300"
            disabled={isLastPage}
            onClick={() => setPageNumber((prev) => prev + 1)}
            aria-label="next butuon"
            type="button"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
