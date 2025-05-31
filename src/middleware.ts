import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /blog, /about)
  const path = request.nextUrl.pathname

  // Allow /lock as a public path
  const isPublicPath = path === '/lock' || 
    path === '/api/auth' || 
    path.startsWith('/_next') || 
    path.startsWith('/images') ||
    path.startsWith('/api/') ||
    path.includes('.')

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has('cc_gate_open')

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated) {
    // Redirect to /lock instead of home
    return NextResponse.redirect(new URL('/lock', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)',
  ],
} 