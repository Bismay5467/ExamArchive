import { z } from 'zod';
import React, { JSX } from 'react';

import { uploadFilesInputSchema } from '@/schemas/uploadSchema';

export type TFileUploadFormFields = z.infer<typeof uploadFilesInputSchema>;

export type TTab = 'display' | 'upload' | null;
export interface ITabOption {
  key: TTab;
  title: {
    icon: React.ReactElement;
    title: string;
  };
  children: React.ReactElement | null | JSX.Element;
}
