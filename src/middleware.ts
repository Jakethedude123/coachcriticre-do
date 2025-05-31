import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the user is trying to access the lock page
  const isLockPage = path === '/lock'

  // If not on lock page, redirect to lock
  if (!isLockPage) {
    return NextResponse.redirect(new URL('/lock', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - images folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|images).*)',
  ],
} 