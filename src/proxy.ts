import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const knownSlugs = new Set(projects.map((project) => project.slug));

// Case study pages stream, so a notFound() inside the page can only send a
// soft 404 (status 200 + noindex). Checking the slug here returns a real 404.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !knownSlugs.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/projects/:slug",
};
