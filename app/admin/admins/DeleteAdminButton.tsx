"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteAdminAction } from "../../actions";

export default function DeleteAdminButton({
  adminId,
  adminName,
}: {
  adminId: number;
  adminName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = confirm(
      `Hapus admin ${adminName}? Tindakan ini permanen.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteAdminAction(adminId);
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
      title="Hapus Admin"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
