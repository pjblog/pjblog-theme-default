import { useAsync } from "@codixjs/fetch";
import { useRequestConfigs } from "../request";
import { getCategories } from "./service";

export function useCategories() {
  const configs = useRequestConfigs();
  return useAsync(getCategories.namespace, () => getCategories(configs));
}