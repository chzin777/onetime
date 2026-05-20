"use client";

import Link from "next/link";
import { useState } from "react";
import { Share2, Copy, Check, ExternalLink } from "lucide-react";
import type { Establishment } from "@/lib/mock-data";

export default function ShareLinkCard({
  establishments,
}: {
  establishments: Establishment[];
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function buildUrl(slug: string) {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/b/${slug}`;
    }
    return `/b/${slug}`;
  }

  async function copy(id: string, slug: string) {
    try {
      await navigator.clipboard.writeText(buildUrl(slug));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
      <Share2 className="w-6 h-6" />
      <h3 className="mt-3 font-bold">Compartilhe seus links</h3>
      <p className="text-xs text-indigo-100 mt-1">
        Cada estabelecimento tem um link próprio.
      </p>

      <div className="mt-4 space-y-2">
        {establishments.map((e) => {
          const url = buildUrl(e.slug);
          const copied = copiedId === e.id;
          return (
            <div
              key={e.id}
              className="rounded-xl bg-white/10 backdrop-blur p-3 border border-white/10"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate">{e.name}</div>
                  <div className="mt-0.5 text-[10px] font-mono text-indigo-100 truncate">
                    {url}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <button
                  onClick={() => copy(e.id, e.slug)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white text-indigo-600 hover:bg-indigo-50 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copiar
                    </>
                  )}
                </button>
                <Link
                  href={`/b/${e.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/15 text-white hover:bg-white/25 transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
