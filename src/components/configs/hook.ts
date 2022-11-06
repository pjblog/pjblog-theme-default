import { useAsync } from '@codixjs/fetch';
import { useRequestConfigs } from '../request';
import { getConfigs } from './service';
export function useConfigs() {
  const configs = useRequestConfigs();
  return useAsync(getConfigs.namespace, () => getConfigs(configs));
}