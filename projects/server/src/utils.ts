export const CORS_HEADERS = new Headers({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods':
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
});

export function withCors(
  handler: (
    req: Request,
    server: any,
  ) => Response | Promise<Response>,
) {
  return (req: Request, server: any) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    const response = handler(req, server);

    const applyCors = (res: Response) => {
      CORS_HEADERS.forEach((value, key) => {
        res.headers.set(key, value);
      });
      return res;
    };

    return response instanceof Promise
      ? response.then(applyCors)
      : applyCors(response);
  };
}
