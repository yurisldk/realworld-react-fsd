export { articleTypes } from './article';
export { authTypes } from './auth';
export { commentTypes } from './comment';
export { favoriteTypes } from './favorite';
export { profileTypes } from './profile';
export { tagTypes } from './tag';

export type UnexpectedErrorDto = {
  errors: {
    body: string[];
  };
};
