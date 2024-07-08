import React from 'react';
import { cn } from '@/lib/utils';
import { FiUploadCloud } from 'react-icons/fi';
import { TFile } from '@/pages/DashBoard/FileUpload/FileUploadForm/FileUploadForm';
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  file: TFile;
}

const getFileUrl = (data: string) => {
  data = data.split(',')[1];
  const binaryString = atob(data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

const FileInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, file, ...props }, ref) => {
    return (
      <>
        <div
          className={cn(
            'flex flex-col items-center py-8 relative border-2 rounded-lg h-30',
            className
          )}
        >
          {file === null && (
            <>
              <FiUploadCloud className="text-[100px] text-pink-400" />
              {/* <h2 className="font-semibold">{file.filename}</h2> */}
              <h3 className="px-4 text-center text-xs sm:text-medium">
                <span className="text-blue-600">Click here</span> to upload your
                file or drag and drop
              </h3>
              <h3 className="px-4 text-xs opacity-50 sm:text-sm">
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
          {file?.dataURI && (
            <>
              <iframe src={getFileUrl(file.dataURI)} className="w-[100%]">
                <div>No online PDF viewer installed</div>
              </iframe>
            </>
          )}
        </div>
      </>
    );
  }
);
FileInput.displayName = 'File Input';

export { FileInput };
