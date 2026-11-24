"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOwner } from "@/contexts/OwnerContext";
import { RoomsView } from "@/components/rooms/RoomsView";

export function PropertyRoomsClient() {
  const params = useParams();
  const propertyId = params?.propertyId as string;
  const { selectProperty } = useOwner();

  useEffect(() => {
    if (propertyId) {
      selectProperty(propertyId);
    }
  }, [propertyId, selectProperty]);

  return <RoomsView showBackToProperties={true} />;
}
