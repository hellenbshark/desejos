import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("session");
  const isAuthPage = request.nextUrl.pathname === "/auth";
  const isHomePage = request.nextUrl.pathname === "/";

  // Se estiver na home, redireciona para auth se não estiver autenticado
  // ou para wishlist se estiver
  if (isHomePage) {
    return NextResponse.redirect(
      new URL(isAuthenticated ? "/wishlist" : "/auth", request.url)
    );
  }

  // Se não estiver autenticado e tentar acessar uma página protegida
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Se estiver autenticado e tentar acessar a página de auth
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/wishlist", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/wishlist/:path*", "/auth"],
};
