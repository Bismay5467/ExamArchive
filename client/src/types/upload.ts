import { uploadFilesInputSchema } from '@/schemas/uploadSchema';
import { z } from 'zod';

export type TFileUploadFormFields = z.infer<typeof uploadFilesInputSchema>;
