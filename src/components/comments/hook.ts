import { useAsyncCallback } from "@codixjs/fetch";
import { useCallback, useState } from "react";
import { postComment } from './service';

export function useCommentPost(aid: number, pid: number) {
  const [text, setText] = useState<string>(null);
  const { loading, execute } = useAsyncCallback(postComment);

  const submit = useCallback(() => execute(aid, pid, text), [aid, pid, text, execute]);

  return {
    text, setText,
    loading, submit,
  }
}