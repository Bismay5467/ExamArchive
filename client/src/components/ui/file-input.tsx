import React from 'react';
import { cn } from '@/lib/utils';
import { FiUploadCloud } from 'react-icons/fi';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { PDF_WORKER_URL } from '@/constants/shared';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  file: File | null;
}

const FileInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, file, ...props }, ref) => {
    return (
      <>
        <div
          className={cn(
            'flex flex-col items-center py-8 relative border-2 rounded-lg max-h-[300px] overflow-y-auto',
            className
          )}
        >
          {file ? (
            <>
              <Worker workerUrl={PDF_WORKER_URL}>
                <Viewer fileUrl={URL.createObjectURL(file)} />
              </Worker>
            </>
          ) : (
            <>
              <FiUploadCloud className="text-[100px] text-pink-400" />
              {/* <h2 className="font-semibold">{file.filename}</h2> */}
              <h3 className="px-4 text-center text-xs sm:text-medium">
                <span className="text-blue-600">Click here</span> to upload your
                file{' '}
                <span className="hidden sm:inline-block">or drag and drop</span>
              </h3>
              <h3 className="px-4 text-xs text-center opacity-50 sm:text-sm">
                Supported Formats: .pdf (Less than 5MB)
              </h3>
              <input
                type="file"
                className="w-full h-full absolute block opacity-0 cursor-pointer top-0 left-0 right-0 bottom-0"
                ref={ref}
                {...props}
              />{' '}
            </>
          )}
        </div>
      </>
    );
  }
);
FileInput.displayName = 'File Input';

export { FileInput };
