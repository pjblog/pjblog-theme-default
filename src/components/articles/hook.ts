import { useRequestQuery, redirect, replace, useRequestParam } from '@codixjs/codix';
import { useAsync } from '@codixjs/fetch';
import { useRequestConfigs } from '../request';
import { getHttpArticle, getHttpArticles, getHttpRelativeArticles } from './service';
import { numberic } from '../utils';
import { useCallback, useMemo } from 'react';

export function useArticlesQuery() {
  const category = useRequestQuery('category', numberic(0)) as number;
  const tag = useRequestQuery('tag', numberic(0)) as number;
  const keyword = useRequestQuery('keyword') as string;
  const page = useRequestQuery('page', numberic(1)) as number;
  return {
    category, tag, keyword, page,
  }
}

export function useArticles() {
  const configs = useRequestConfigs();
  const params = useArticlesQuery();
  return useAsync(
    getHttpArticles.namespace(params), 
    () => getHttpArticles(params, configs), 
    [params.category, params.tag, params.keyword, params.page]
  );
}

export function useArticlesLocation() {
  const { category, tag, keyword, page } = useArticlesQuery();
  const params = useMemo(() => {
    const _params = {
      category: category + '', 
      tag: tag + '', 
      keyword: null, 
      page: page + '', 
    }
    if (!category) Reflect.deleteProperty(_params, 'category');
    if (!tag) Reflect.deleteProperty(_params, 'tag');
    if (!keyword) Reflect.deleteProperty(_params, 'keyword');
    if (!page) Reflect.deleteProperty(_params, 'page');
    if (page === 1) Reflect.deleteProperty(_params, 'page');
    return _params;
  }, [category, tag, keyword, page]);
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
  return useAsync(
    getHttpArticle.namespace(id), 
    () => getHttpArticle(id, configs), 
    [id]
  );
}

export function useRelativeArticles(id: number, size: number) {
  const configs = useRequestConfigs();
  return useAsync(
    getHttpRelativeArticles.namespace(id, size), 
    () => getHttpRelativeArticles(id, size, configs), 
    [id, size]
  )
}