Middleware - Allowing public route: /blog/cmbnebiw50000h1rh62dd699x
Error: Route "/blog/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at PostPage (app/blog/[id]/page.tsx:39:40)
  37 |
  38 | export default async function PostPage({ params }: { params: { id: string } }) {
> 39 |   const data = await getPostById(params.id);
     |                                        ^
  40 |
  41 |   if (!data || !data.post) {
  42 |     notFound();
 GET /blog/cmbnebiw50000h1rh62dd699x 200 in 2499ms