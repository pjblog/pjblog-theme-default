import { IMe } from "@pjblog/blog";
import { createContext, useContext } from "react";

export const MeContext = createContext<IMe>({
  account: null,
  nickname: null,
  email: null,
  avatar: null,
  forbiden: false,
  website: null,
  admin: false,
});

export function useMe() {
  return useContext(MeContext);
}