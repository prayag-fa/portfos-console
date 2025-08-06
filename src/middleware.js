import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "864ad028-bfb3-4925-b47a-3047dd4d0144");
  requestHeaders.set("x-createxyz-project-group-id", "b7219dbc-5cf4-4bfd-9199-f281bbc32f6d");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}