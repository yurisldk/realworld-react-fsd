import { RestRequest } from 'msw';

export function parseTokenFromRequest(req: RestRequest) {
  const tokenHeader = req.headers.get('authorization') ?? '';

  const isValidToken = Boolean(tokenHeader.startsWith('Token '));

  if (!isValidToken) return null;

  const [, token] = tokenHeader.split(' ');

  return token;
}
