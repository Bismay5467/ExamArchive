import { CLIENT_ROUTE } from '../route';

export const toPreviewPage = (paperid: string) =>
  `${CLIENT_ROUTE.FILE_PREVIEW}/${paperid}`;
