import type { Metadata } from "next"

import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { WordsManager } from "@/components/admin/words-manager"

export const metadata: Metadata = {
  title: "Admin — Vocabulary | Lingua",
  description: "Manage the Lingua vocabulary library: create, edit and delete word entries.",
}

export default function AdminWordsPage() {
  return (
    <main className="p-4 md:p-6 lg:p-8 h-screen">
      <div className="flex bg-card mx-auto border rounded-[2rem] max-w-7xl h-full overflow-hidden">
        <AdminSidebar />

        <div className="flex-1 bg-secondary/40 p-5 md:p-6 lg:p-8 pb-24 md:pb-6">
          <AdminHeader />

          <div className="mt-6">
            <WordsManager />
          </div>
        </div>
      </div>
    </main>
  )
}
