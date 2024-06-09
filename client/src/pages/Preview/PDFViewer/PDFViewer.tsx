import { pdfjs, Document, Page } from 'react-pdf';
import { useState } from 'react';
import { Button } from '@nextui-org/react';
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
        <span className="absolute bottom-4 left-[45%]">
          Page {pageNumber} of {totalPages}
        </span>
        <Button
          color="primary"
          variant="ghost"
          className="absolute bottom-4 right-4"
          onDoubleClick={() => setPageNumber((prev) => prev + 1)}
          isDisabled={isLastPage}
        >
          Next
        </Button>
        <Button
          color="primary"
          variant="ghost"
          className="absolute bottom-4 left-4"
          onDoubleClick={() => setPageNumber((prev) => prev - 1)}
          isDisabled={isFirstPage}
        >
          Prev
        </Button>
      </div>
    </div>
  );
}
