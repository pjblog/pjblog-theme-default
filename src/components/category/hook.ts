import { useAsync } from "@codixjs/fetch";
import { useRequestConfigs } from "../request";
import { getHttpCategories } from "./service";

export function useCategories() {
  const configs = useRequestConfigs();
  return useAsync(getHttpCategories.namespace, () => getHttpCategories(configs));
}