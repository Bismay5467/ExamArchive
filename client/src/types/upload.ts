import { z } from 'zod';

import { uploadFilesInputSchema } from '@/schemas/uploadSchema';

export type TFileUploadFormFields = z.infer<typeof uploadFilesInputSchema>;
