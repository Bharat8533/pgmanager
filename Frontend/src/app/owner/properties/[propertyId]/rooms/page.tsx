import React, { Suspense } from "react";
import { PropertyRoomsClient } from "./PropertyRoomsClient";
import { MOCK_PROPERTIES } from "@/constants/mockData";

export function generateStaticParams() {
  return MOCK_PROPERTIES.map((p) => ({
    propertyId: p.id,
  }));
}

export default function PropertyRoomsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-brand-muted">Loading room inventory...</div>}>
      <PropertyRoomsClient />
    </Suspense>
  );
}
