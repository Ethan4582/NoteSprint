"use client";

import { useParams } from "next/navigation";
import PreviewClient from "./PreviewClient";

export default function PreviewPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  return <PreviewClient id={id} />;
}
