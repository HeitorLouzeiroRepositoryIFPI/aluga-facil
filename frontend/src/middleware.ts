import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // URLs públicas que não precisam de autenticação
  const publicUrls = ['/login', '/register', '/api/auth/login']
  if (publicUrls.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Verifica o token nos cookies
  const token = request.cookies.get('auth_token')?.value

  // Se não estiver autenticado, redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protege a rota do dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const userType = request.cookies.get('user_type')?.value
    if (!userType) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
