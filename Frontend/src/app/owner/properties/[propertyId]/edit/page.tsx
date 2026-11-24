import React, { Suspense } from "react";
import { EditPropertyClient } from "./EditPropertyClient";

export async function generateStaticParams() {
  return [
    { propertyId: "prop-1" },
    { propertyId: "prop-2" },
    { propertyId: "prop-3" },
    { propertyId: "prop-4" },
    { propertyId: "prop-5" },
    { propertyId: "prop-6" },
  ];
}

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-brand-muted font-medium">
          Loading property specifications...
        </div>
      }
    >
      <EditPropertyClient propertyId={propertyId} />
    </Suspense>
  );
}
