import type { AxiosRequestConfig } from 'axios';
import { useRequestHeader } from '@codixjs/codix';

export const requestBaseURL = '/api';
export function useRequestConfigs(): AxiosRequestConfig {
  const host = useRequestHeader<string>('host');
  const cookie = useRequestHeader<string>('cookie');
  const referer = useRequestHeader<string>('referer');
  const protocol = getProtocol(referer);
  if (!host) return {};
  return {
    baseURL: protocol + host + requestBaseURL,
    headers: {
      cookie
    }
  }
}

function getProtocol(referer: string) {
  if (!referer) return 'http://';
  const index = referer.indexOf('//');
  if (index === -1) return 'http://';
  return referer.substring(0, index + 2);
}