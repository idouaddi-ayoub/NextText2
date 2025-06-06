"use client";

import { format } from "date-fns";
import { useBoxStore } from "@/store/boxStore";
import { useState, useEffect } from "react";
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

type BoxType = "Regard double" | "Regard de chasse" | "Regard normal";

interface EditingEntry {
  date: string;
  boxType: BoxType;
  numberOfBoxes: number;
  totalCost: number;
}

export default function TablePage() {
  const {
    entries,
    isLoading,
    error,
    fetchEntries,
    addEntry,
    editEntry,
    deleteEntry,
    importEntries,
  } = useBoxStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<EditingEntry | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newEntry, setNewEntry] = useState<EditingEntry>({
    date: format(new Date(), "yyyy-MM-dd"),
    boxType: "Regard normal",
    numberOfBoxes: 0,
    totalCost: 0,
  });

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleExportCSV = () => {
    const csvContent = [
      [
        "Date",
        "Type de boîte",
        "Nombre de boîtes",
        "Coût total",
        "Coût unitaire",
        "Prix Unitaire",
        "Marge unitaire",
        "Marge totale",
      ],
      ...entries.map((entry) => [
        format(new Date(entry.date), "dd/MM/yyyy"),
        entry.boxType,
        entry.numberOfBoxes,
        entry.totalCost,
        entry.totalCost / entry.numberOfBoxes,
        entry.unitCost,
        entry.unitMargin,
        entry.totalMargin,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `export_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split("\n").slice(1); // Skip header row
      const newEntries = rows
        .filter((row) => row.trim())
        .map((row) => {
          const [date, boxType, numberOfBoxes, totalCost] = row.split(",");
          return {
            date: format(
              new Date(date.split("/").reverse().join("-")),
              "yyyy-MM-dd"
            ),
            boxType: boxType as BoxType,
            numberOfBoxes: Number(numberOfBoxes),
            totalCost: Number(totalCost),
          };
        });
      importEntries(newEntries);
    };
    reader.readAsText(file);
  };

  const handleEdit = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setEditingId(id);
      setEditingValues({
        date: entry.date,
        boxType: entry.boxType,
        numberOfBoxes: entry.numberOfBoxes,
        totalCost: entry.totalCost,
      });
    }
  };

  const handleSaveEdit = async () => {
    if (editingId && editingValues) {
      await editEntry(editingId, editingValues);
      setEditingId(null);
      setEditingValues(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValues(null);
  };

  const handleAddNew = async () => {
    await addEntry(newEntry);
    setNewEntry({
      date: format(new Date(), "yyyy-MM-dd"),
      boxType: "Regard normal",
      numberOfBoxes: 0,
      totalCost: 0,
    });
    setShowNewForm(false);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p>Une erreur s&apos;est produite: {error}</p>
          <button
            onClick={() => fetchEntries()}
            className="mt-2 text-sm font-semibold text-red-600 hover:text-red-500"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tableau des données</h2>
        <div className="flex gap-4">
          <button
            onClick={handleExportCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 disabled:opacity-50"
            disabled={isLoading}
          >
            Exporter CSV
          </button>
          <label
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 cursor-pointer disabled:opacity-50 ${
              isLoading ? "pointer-events-none" : ""
            }`}
          >
            Importer CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImportCSV}
              disabled={isLoading}
            />
          </label>
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 disabled:opacity-50"
            disabled={isLoading}
          >
            Ajouter une ligne
          </button>
        </div>
      </div>

      <div className="overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type de boîte
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre de boîtes
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Coût total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Coût unitaire
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Prix Unitaire
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Marge unitaire
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Marge totale
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {showNewForm && (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, date: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={newEntry.boxType}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        boxType: e.target.value as BoxType,
                      })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="Regard normal">Regard normal</option>
                    <option value="Regard double">Regard double</option>
                    <option value="Regard de chasse">Regard de chasse</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={newEntry.numberOfBoxes}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        numberOfBoxes: Number(e.target.value),
                      })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={newEntry.totalCost}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        totalCost: Number(e.target.value),
                      })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </td>
                <td colSpan={4}></td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={handleAddNew}
                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowNewForm(false)}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )}
            {entries.map((row) => (
              <tr key={row.id}>
                {editingId === row.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        value={editingValues?.date}
                        onChange={(e) =>
                          setEditingValues({
                            ...editingValues!,
                            date: e.target.value,
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={editingValues?.boxType}
                        onChange={(e) =>
                          setEditingValues({
                            ...editingValues!,
                            boxType: e.target.value as BoxType,
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="Regard normal">Regard normal</option>
                        <option value="Regard double">Regard double</option>
                        <option value="Regard de chasse">
                          Regard de chasse
                        </option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={editingValues?.numberOfBoxes}
                        onChange={(e) =>
                          setEditingValues({
                            ...editingValues!,
                            numberOfBoxes: Number(e.target.value),
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={editingValues?.totalCost}
                        onChange={(e) =>
                          setEditingValues({
                            ...editingValues!,
                            totalCost: Number(e.target.value),
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </td>
                    <td colSpan={4}></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(row.date), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.boxType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.numberOfBoxes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.totalCost.toLocaleString("fr-FR")} MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(row.totalCost / row.numberOfBoxes).toLocaleString(
                        "fr-FR"
                      )}{" "}
                      MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.unitCost.toLocaleString("fr-FR")} MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(
                        row.unitCost -
                        row.totalCost / row.numberOfBoxes
                      ).toLocaleString("fr-FR")}{" "}
                      MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.totalMargin.toLocaleString("fr-FR")} MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(row.id)}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteEntry(row.id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
