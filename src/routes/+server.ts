import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const res = await fetch('http://localhost:1337/api/posts?populate=*');
  const data = await res.json();

  return json(data);
};
