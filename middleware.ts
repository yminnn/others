export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/keywords/:path*", "/alerts/:path*", "/settings/:path*", "/login"],
};
