import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role, User } from "./app/utils/types";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token");

  if (request.url.includes("/auth")) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (request.url.includes("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signup", request.url));
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: (res as any).message },
        { status: 500 }
      );
    }
    const user: User = await res.json();

    if (user.role.toLowerCase() == Role.Complainer.toLocaleLowerCase()) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*"],
};
