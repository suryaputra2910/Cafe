"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteCustomerAction } from "../../actions";

export default function DeleteCustomerButton({
  customerId,
  customerName,
}: {
  customerId: number;
  customerName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = confirm(
      `Hapus customer ${customerName}? Tindakan ini permanen.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteCustomerAction(customerId);
      if (result?.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-700 rounded-xl transition border border-red-200/50 cursor-pointer"
      title="Hapus Customer"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
