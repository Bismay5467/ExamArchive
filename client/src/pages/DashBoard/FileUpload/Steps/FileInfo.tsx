import { Input } from '@/components/ui/input';
import { TFileUploadFormFields } from '@/types/upload';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function FileInfo({
  form,
}: {
  form: UseFormReturn<TFileUploadFormFields>;
}) {
  return (
    <section className="p-4 flex flex-col gap-y-6">
      <FormField
        control={form.control}
        name="institution"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-4">
            <FormLabel className="min-w-fit self-center font-semibold text-xl">
              Institute:
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                className="cursor-pointer"
                placeholder="My broke ass College..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="subjectCode"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-4">
            <FormLabel className="min-w-fit self-center font-semibold text-xl">
              Subject Code:
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                className="cursor-pointer"
                placeholder="My Shitty Subject..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="subjectName"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-4">
            <FormLabel className="min-w-fit self-center font-semibold text-xl">
              Subject Name:
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                className="cursor-pointer"
                placeholder="Baler subject Name..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}
