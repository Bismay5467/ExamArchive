import { cn } from '@/lib/utils';
import React from 'react';
import cloud from '@/assets/cloud.svg';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  filename: string | undefined;
}

const FileInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, filename, ...props }, ref) => (
    <div
      className={cn(
        'flex flex-col items-center py-8 relative border-4 border-dashed rounded-3xl ring-4 ring-[#dde3fcb3]',
        className
      )}
    >
      <img src={cloud} alt="" className="w-[100px]" />
      {filename && <h2 className="font-semibold">{filename}</h2>}
      <h3>
        <span className="text-blue-600">Click here</span> to upload your file or
        drag and drop
      </h3>
      <h3 className="text-sm opacity-50">
        Supported Formats: .PDF (Less than 5MB)
      </h3>
      <input
        type="file"
        className="w-full h-full absolute block opacity-0 cursor-pointer top-0 left-0 right-0 bottom-0"
        ref={ref}
        {...props}
      />
    </div>
  )
);
FileInput.displayName = 'File Input';

export { FileInput };
