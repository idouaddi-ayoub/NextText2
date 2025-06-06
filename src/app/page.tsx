"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useBoxStore } from "@/store/boxStore";

type BoxType = "Regard double" | "Regard de chasse" | "Regard normal";

interface FormData {
  date: string;
  boxType: BoxType;
  numberOfBoxes: number;
  totalCost: number;
}

export default function Home() {
  const addEntry = useBoxStore((state) => state.addEntry);
  const [formData, setFormData] = useState<FormData>({
    date: format(new Date(), "yyyy-MM-dd"),
    boxType: "Regard normal",
    numberOfBoxes: 0,
    totalCost: 0,
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      addEntry(formData);
      setMessage({
        type: "success",
        text: "Données enregistrées avec succès!",
      });

      // Reset form
      setFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        boxType: "Regard normal",
        numberOfBoxes: 0,
        totalCost: 0,
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({
        type: "error",
        text: "Erreur lors de l'enregistrement des données.",
      });
    }
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-2xl">
        <div className="bg-white shadow-sm sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Saisie des données
            </h2>

            {message && (
              <div
                className={`mt-4 rounded-md p-4 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                    : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="boxType"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Type de boîte
                </label>
                <div className="mt-2">
                  <select
                    id="boxType"
                    value={formData.boxType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        boxType: e.target.value as BoxType,
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    required
                  >
                    <option value="Regard normal">Regard normal</option>
                    <option value="Regard double">Regard double</option>
                    <option value="Regard de chasse">Regard de chasse</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="numberOfBoxes"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nombre de boîtes
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    id="numberOfBoxes"
                    min="0"
                    value={formData.numberOfBoxes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numberOfBoxes: parseInt(e.target.value),
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="totalCost"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Coût total (MAD)
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    id="totalCost"
                    min="0"
                    value={formData.totalCost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalCost: parseFloat(e.target.value),
                      })
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
