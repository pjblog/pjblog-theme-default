import { useAsync, useAsyncCallback } from "@codixjs/fetch";
import { useCallback, useState } from "react";
import { useRequestConfigs } from "../request";
import { setHttpLink, getHttpLinks } from "./service";
import { redirect, replace } from '@codixjs/codix';

export function useLinks(size: number = 0) {
  const configs = useRequestConfigs();
  return useAsync(getHttpLinks.namespace(size), () => getHttpLinks(configs, size));
}

export function useLink() {
  const [name, setName] = useState<string>(null);
  const [icon, setIcon] = useState<string>(null);
  const [url, setUrl] = useState<string>(null);
  const { loading, execute } = useAsyncCallback(setHttpLink);
  const submit = useCallback(() => {
    if (!name) return Promise.reject(new Error('请输入友情链接名'));
    if (!icon) return Promise.reject(new Error('请输入友情链接图标地址'));
    if (!url) return Promise.reject(new Error('请输入友情链接地址'));
    return execute(name, icon, url);
  }, [name, icon, url, execute]);

  return {
    name, setName,
    icon, setIcon,
    url, setUrl,
    loading, submit,
  }
}