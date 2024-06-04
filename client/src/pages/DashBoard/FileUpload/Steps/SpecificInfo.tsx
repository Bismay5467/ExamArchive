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

export default function SpecificInfo({
  form,
}: {
  form: UseFormReturn<TFileUploadFormFields>;
}) {
  return (
    <section className="p-4 flex flex-col gap-y-6">
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-4">
            <FormLabel className="min-w-fit self-center font-semibold text-xl">
              Year:
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                className="cursor-pointer"
                placeholder="It's a Leap Year"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="semester"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-4">
            <FormLabel className="min-w-fit self-center font-semibold text-xl">
              Semester:
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                className="cursor-pointer"
                placeholder="Same Shitty semester"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="examType"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-4">
            <FormLabel className="min-w-fit self-center font-semibold text-xl">
              Exam Type
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                className="cursor-pointer"
                placeholder="Why exams are nessesary!"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-4">
            <FormLabel className="min-w-fit self-center font-semibold text-xl">
              Tags
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                className="cursor-pointer"
                placeholder="Ye zinda hu wo kafi nahi?"
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
