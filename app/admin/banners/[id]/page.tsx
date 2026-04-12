"use client";

import { use } from "react";
import { BannerEditorForm } from "@/components/admin/BannerEditorForm";

export default function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <BannerEditorForm bannerId={id} />;
}
