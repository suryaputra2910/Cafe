"use server";

import { logoutAction } from "@/app/actions";
import { redirect } from "next/navigation";

export async function handleAdminLogout() {
  await logoutAction();
  redirect("/login");
}
