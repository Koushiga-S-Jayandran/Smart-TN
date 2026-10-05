"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Step4({ searchParams }: { searchParams: Promise<{ district?: string; type?: string; days?: string }> }) {
  const { district, type, days } = use(searchParams);
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!district || !type || !days) {
    return (
      <div className="text-center py-20">
        <p>Some details are missing.</p>
        <Link href="/plan" className="text-red-900 underline">Start again</Link>
      </div>
    );
  }

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ district, category: type, days: Number(days), date }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || "Something went wrong");
      router.push(`/plans/${data.id}`);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <p className="text-sm text-red-900 font-semibold mb-2">Step 4 of 4 · Generate</p>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Your trip summary</h1>
        <p className="mb-4 text-gray-700">
          <b>{district}</b> · <span className="capitalize">{type}</span> · {days} day(s)
        </p>
        <label className="block text-sm font-medium mb-4">
          Start date (used for crowd prediction)
          <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border px-4 py-3" />
        </label>
        {error && <p className="text-red-700 text-sm bg-red-50 rounded-lg p-3 mb-3">{error}</p>}
        <button onClick={generate} disabled={loading}
          className="w-full rounded-xl bg-red-900 text-white py-3 font-semibold disabled:opacity-60">
          {loading ? "✨ Crafting your itinerary... (10–20 sec)" : "✨ Generate my plan"}
        </button>
      </div>
    </div>
  );
}