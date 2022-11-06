import { useRequestQuery, redirect, replace, useRequestParam } from '@codixjs/codix';
import { useAsync } from '@codixjs/fetch';
import { useRequestConfigs } from '../request';
import { getArticle, getArticles, getRelativeArticles } from './service';
import { numberic } from '../utils';
import { useCallback, useMemo } from 'react';

export function useArticlesQuery() {
  const category = useRequestQuery('category', numberic(0)) as number;
  const tag = useRequestQuery('tag', numberic(0)) as number;
  const keyword = useRequestQuery('keyword') as string;
  const page = useRequestQuery('page', numberic(1)) as number;
  const size = useRequestQuery('size', numberic(10)) as number;
  return {
    category, tag, keyword, page, size,
  }
}

export function useArticles() {
  const configs = useRequestConfigs();
  const params = useArticlesQuery();
  const code = [
    'c', params.category || '', 
    't', params.tag || '', 
    'k', params.keyword || '', 
    'p', params.page || '', 
    's', params.size || ''
  ].join(':');
  return useAsync(getArticles.namespace + ':' + code, () => getArticles(params, configs), [
    params.category, params.tag, params.keyword, params.page, params.size
  ]);
}

export function useArticlesLocation() {
  const { category, tag, keyword, page, size } = useArticlesQuery();
  const params = useMemo(() => {
    const _params = {
      category: category + '', 
      tag: tag + '', 
      keyword: null, 
      page: page + '', 
      size: size + '',
    }
    if (!category) Reflect.deleteProperty(_params, 'category');
    if (!tag) Reflect.deleteProperty(_params, 'tag');
    if (!keyword) Reflect.deleteProperty(_params, 'keyword');
    if (!page) Reflect.deleteProperty(_params, 'page');
    if (!size) Reflect.deleteProperty(_params, 'size');
    return _params;
  }, [category, tag, keyword, page, size]);
  return {
    redirect: useCallback((options: Partial<ReturnType<typeof useArticlesQuery>> = {}) => {
      return redirect('/', Object.assign({}, params, options));
    }, [params]),
    replace: useCallback((options: Partial<ReturnType<typeof useArticlesQuery>> = {}) => {
      return replace('/', Object.assign({}, params, options));
    }, [params]),
  }
}

export function useArticle() {
  const id = useRequestParam('id') as string;
  const configs = useRequestConfigs();
  return useAsync(getArticle.namespace + id, () => getArticle(id, configs), [id]);
}

export function useArticleLocation() {
  return {
    redirect: useCallback((id: string) => redirect('/article/' + id), []),
    replace: useCallback((id: string) => replace('/article/' + id), []),
  }
}

export function useRelativeArticles(id: number, size: number) {
  const configs = useRequestConfigs();
  return useAsync(
    getRelativeArticles.namespace + ':' + id + ':' + size, 
    () => getRelativeArticles(id, size, configs), 
    [id, size]
  )
}