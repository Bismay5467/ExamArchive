import getSearchRequestObj from './search';
import { getResetObj, getSignInObj, getSignUpObj } from './auth';
import {
  getFileObj,
  deleteFileObj,
  updateRatingObj,
  editTagsObj,
} from './file';
import {
  reportObj,
  resolveReportObj,
  viewReportsObj,
  getCommentBody,
} from './report';
import {
  getFilesDataObj,
  createFolderObj,
  getFolderNameObj,
  deleteFolderObj,
} from './folder';
import {
  getCommentsObj,
  postCommentObj,
  deleteCommentObj,
  editCommentObj,
  reactToCommentObj,
} from './comments';
import {
  getModeratorsObj,
  removeModeratorObj,
  addModeratorObj,
} from './superadmin';
import fileUploadObj from './fileUpload';

export {
  getSearchRequestObj,
  fileUploadObj,
  getSignInObj,
  getSignUpObj,
  getResetObj,
  getFileObj,
  reportObj,
  getCommentBody,
  resolveReportObj,
  viewReportsObj,
  deleteFileObj,
  editTagsObj,
  getFilesDataObj,
  createFolderObj,
  getFolderNameObj,
  deleteFolderObj,
  getCommentsObj,
  postCommentObj,
  deleteCommentObj,
  editCommentObj,
  reactToCommentObj,
  updateRatingObj,
  getModeratorsObj,
  removeModeratorObj,
  addModeratorObj,
};
