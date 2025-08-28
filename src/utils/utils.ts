import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  iat: number;
  sub: string;
};

export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Math.floor(Date.now() / 1000); // segundos atuais
    return decoded.exp < now;
  } catch {
    return true; // se não conseguir decodificar, consideramos expirado
  }
}
