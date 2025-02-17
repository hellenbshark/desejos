// Arquivo pode ser removido

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  // Remover toda lógica de autenticação
  return NextResponse.next();
}

export const config = {
  matcher: ['/wishlist/:path*']
};
