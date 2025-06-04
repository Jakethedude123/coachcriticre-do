// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname
//   // Only gate the homepage
//   if (path === '/') {
//     return NextResponse.redirect(new URL('/lock', request.url))
//   }
//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/'], // Only gate the homepage
// } 