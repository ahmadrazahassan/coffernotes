import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ExitInterstitial } from "@/components/shared/ExitInterstitial";
import { SITE_NAME } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Leaving ${SITE_NAME}`,
    robots: { index: false, follow: false },
  };
}

export default async function LeavingPage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: link } = await supabase
    .from("redirect_links")
    .select("slug, destination, label")
    .eq("slug", slug)
    .single();

  if (!link) {
    notFound();
  }

  // Extract display domain from destination URL
  let displayDomain = link.destination;
  try {
    displayDomain = new URL(link.destination).hostname.replace(/^www\./, "");
  } catch {
    // keep raw URL if parsing fails
  }

  return (
    <ExitInterstitial
      slug={link.slug}
      destination={link.destination}
      label={link.label}
      displayDomain={displayDomain}
    />
  );
}
