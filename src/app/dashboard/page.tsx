"use client";

import { useState } from "react";
import { BoxEntry } from "@/lib/supabase";
import BoxesTable from "@/components/BoxesTable";
import BoxesGraph from "@/components/BoxesGraph";

export default function Dashboard() {
  const [selectedBoxType, setSelectedBoxType] = useState<
    BoxEntry["box_type"] | "all"
  >("all");

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Gérez vos boîtes et visualisez les statistiques
        </p>
      </div>

      <div className="mb-8">
        <BoxesGraph selectedBoxType={selectedBoxType} />
      </div>

      <div>
        <BoxesTable
          selectedBoxType={selectedBoxType}
          onBoxTypeChange={setSelectedBoxType}
        />
      </div>
    </div>
  );
}
