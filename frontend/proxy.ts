import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/routes/user-account/verify-email' || path === '/routes/user-account/verify-email' || path === '/routes/user-account/verify-email'

    const token = request.cookies.get('accessToken')?.value || ''

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    // if (!isPublicPath && !token) {
    //     return NextResponse.redirect(new URL('/', request.nextUrl))
    // }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/routes/user-account/profile',
        '/routes/user-account/log-in',
        '/routes/user-account/sign-up',
        '/routes/user-account/verify-email'
    ]
}