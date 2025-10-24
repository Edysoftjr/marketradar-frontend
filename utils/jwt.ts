// lib/utils/jwt.ts
export function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
