"use client";

import { useState, useTransition } from "react";
import { Pencil, X, Check } from "lucide-react";
import { updateCustomerAction } from "../../actions";

export default function CustomerEditForm({
  customerId,
  initialName,
  initialPhone,
}: {
  customerId: number;
  initialName: string;
  initialPhone: string;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition border border-stone-200/50"
        title="Edit Customer"
      >
        <Pencil className="h-4 w-4" />
      </button>
    );
  }

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const res = await updateCustomerAction(customerId, { name, phone });
      if (res?.error) {
        setError(res.error);
      } else {
        setEditing(false);
        // Reload so the list reflects the update from Railway.
        window.location.reload();
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 bg-stone-50 border border-stone-200 rounded-xl p-3 w-64">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama"
        className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-stone-900"
      />
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Nomor HP"
        className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-stone-900"
      />
      {error && <p className="text-[10px] text-red-600 font-semibold">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setEditing(false);
            setName(initialName);
            setPhone(initialPhone);
            setError(null);
          }}
          className="p-1.5 bg-white hover:bg-stone-100 text-stone-600 rounded-lg border border-stone-200 transition disabled:opacity-50"
          title="Batal"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
          title="Simpan"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
