import { request } from '../request';

export async function postComment(aid: number, pid: number, text: string) {
  const res = await request.post('/comment', {
    aid, pid, text,
  })
  return res.data;
}