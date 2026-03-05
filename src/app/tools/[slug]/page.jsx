import { toolMetaMap } from "@/platform/registry/toolMetaMap";
import { notFound } from "next/navigation";
import ToolClient from "./ToolClient";

export default async function ToolPage({ params }) {
  const { slug } = await params;

  if (!toolMetaMap[slug]) {
    notFound();
  }

  return <ToolClient slug={slug} />;
}
