import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TFileUploadFormFields } from '@/types/upload';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { uploadFileTypes } from '@/constants/shared';

export default function Upload({
  form,
}: {
  form: UseFormReturn<TFileUploadFormFields>;
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file && file.length > 0) {
      const fileToEncode = file[0];
      if (fileToEncode.type !== uploadFileTypes.PDF) {
        form.setError('file', {
          type: 'validate',
          message: 'Wrong File type!',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('file', {
          dataURI: reader.result as string,
          name: file[0].name,
        });
      };
      reader.readAsDataURL(file[0]);
    }
  };
  return (
    <section className="p-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>Upload File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={handleFile}
                  className="cursor-pointer"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <Input
          type="text"
          className="w-[500px] mt-4"
          placeholder="Enter collection name"
        />
        <Button className="mt-4">Create new Collection</Button>
      </div>
    </section>
  );
}
