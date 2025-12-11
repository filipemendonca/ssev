import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

async function validateRefreshToken(token: string): Promise<boolean> {
  try {
    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate-refresh`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     // enviamos o token explícito no corpo ou header
    //     body: JSON.stringify({ refresh_token: token }),
    //     cache: "no-store",
    //     credentials: "include",
    //   }
    // );
    const res = await fetch(`/auth/validate-refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // enviamos o token explícito no corpo ou header
      body: JSON.stringify({ refresh_token: token }),
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data.valid === true; // backend responde { valid: true/false }
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const isAuthRoute = pathname === "/sign-in";
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Se houver refresh_token, validar no backend
  let refreshValid = false;
  if (refreshToken) {
    refreshValid = await validateRefreshToken(refreshToken);
  }

  // 1 - Se refresh_token válido e tentar acessar /sign-in → redireciona para dashboard
  if (isAuthRoute && refreshValid) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2 - Se tentar acessar rota protegida (/dashboard) sem access_token ou refresh válido → redireciona para sign-in
  if (isProtectedRoute && !refreshValid) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/dashboard/:path*"],
};
