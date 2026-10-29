import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonStyles, Container, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <Eyebrow>404 · Not found</Eyebrow>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">This page doesn&apos;t exist.</h1>
      <p className="mt-4 max-w-md leading-relaxed text-fg-muted">
        The link may be out of date. The projects and case studies are all reachable from the home page.
      </p>
      <Link href="/" className={`${buttonStyles.primary} mt-8`}>
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to home
      </Link>
    </Container>
  );
}
