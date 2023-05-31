import { useQuery } from '@tanstack/react-query';
import { conduitApi } from '~shared/api';

export const useGlobalTags = () =>
  useQuery(['tags', 'global'], async () => conduitApi.Tags.global());
