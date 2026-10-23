import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { NAVIGATION_SECTIONS } from "@/config/navigation";
import { KioskStatusBanner } from "@/components/dashboard/kiosk-status-banner";
import { KIOSK_INFO } from "@/lib/mock-data";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  const allNavItems = NAVIGATION_SECTIONS.flatMap((group) =>
    group.items.map((item) => ({ ...item, category: group.title }))
  );

  const matchedItem = allNavItems.find(
    (item) => item.href === `/${section}`
  );

  if (!matchedItem) {
    notFound();
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      <KioskStatusBanner kiosk={KIOSK_INFO} />

      <section className="rounded-[18px] sm:rounded-[20px] bg-white p-5 sm:p-7 shadow-[0_4px_14px_rgba(3,70,119,0.06)]">
        <div className="flex items-center gap-2 text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#1D70B8]">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>{matchedItem.category}</span>
        </div>

        <h2 className="text-[20px] sm:text-[24px] font-bold text-[#143350] mt-1.5">
          {matchedItem.label}
        </h2>
        <p className="text-[12px] sm:text-[13.5px] text-[#6B8099] mt-1.5 leading-relaxed max-w-2xl">
          Manage {matchedItem.label.toLowerCase()} settings and real-time controls
          for the WishPix voice-activated generative learning kiosk in{" "}
          <span className="font-semibold text-[#143350]">
            {KIOSK_INFO.roomName}
          </span>
          .
        </p>

        <div className="mt-6 pt-5 border-t border-[#EDF2F7] flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-[11px] bg-[#004A7C] hover:bg-[#003B64] text-white text-[12px] sm:text-[13px] font-semibold px-4 py-2.5 transition"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </Link>

          <Link
            href="/dashboard?nav=open"
            className="text-[11.5px] sm:text-[12.5px] font-semibold text-[#1D70B8] hover:underline lg:hidden"
          >
            Open Menu
          </Link>
        </div>
      </section>
    </div>
  );
}
