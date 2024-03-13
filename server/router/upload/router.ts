/* eslint-disable camelcase */
import { TRPCError } from '@trpc/server';

import { EXAM_TYPES } from '../../constants/constants/shared';
import { IUser } from '../../types/auth/types';
import { TUploadFile } from '../../types/upload/types';
import {
  AddNameToCache,
  GetNamesFromCache,
  NotificationWebhook,
  UploadFile,
} from '../../controllers/upload';
import {
  addNamesInputSchema,
  getNamesInputSchema,
  uploadFilesInputSchema,
} from './schema';
import {
  protectedProcedures,
  publicProcedures,
  router,
} from '../../config/trpcConfig';
// import { getDataURI } from '../../utils/upload/getFile';

const uploadRoute = router({
  upload: protectedProcedures
    .input(uploadFilesInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.user as IUser;
      // const data = [
      //   {
      //     examType: 'Midsem' as never,
      //     file: { dataURI: getDataURI(), name: 'file1' },
      //     tags: 'tag1 tag2',
      //     year: '2023',
      //     institution: 'National Institute of Technology',
      //     branch: 'CSE',
      //     semester: 'Semester I',
      //     subjectCode: 'MA609',
      //     subjectName: 'Operating Systems',
      //   },
      // ];
      // const userId = '65ee10b25481655e46ce747d';
      // await UploadFile(
      //   data as Array<TUploadFile<keyof typeof EXAM_TYPES>>,
      //   userId
      // );
      await UploadFile(
        input as Array<TUploadFile<keyof typeof EXAM_TYPES>>,
        userId
      );
      return { message: 'Files are uploaded successfully' };
    }),
  addName: protectedProcedures
    .input(addNamesInputSchema)
    .mutation(async ({ input }) => {
      await AddNameToCache(input);
      return { message: 'New institution name added to the collection' };
    }),
  getNames: protectedProcedures
    .input(getNamesInputSchema)
    .query(async ({ input }) => {
      const searchResult = await GetNamesFromCache(input);
      return { searchResult };
    }),
  webhook: publicProcedures.mutation(async ({ ctx }) => {
    const { req } = ctx;
    const { public_id, secure_url } = req as unknown as {
      public_id: string;
      secure_url: string;
    };
    if (!(public_id && secure_url)) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: "Couldn't update doc URL",
      });
    }
    await NotificationWebhook({ publicId: public_id, url: secure_url });
    return { message: 'Doc URL was updated successfully' };
  }),
});

export default uploadRoute;
