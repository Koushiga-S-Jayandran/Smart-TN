import Link from "next/link";
import { redirect } from "next/navigation";
import { CATEGORIES, DISTRICTS, isAvailable } from "@/lib/data";

export default async function Step2({ searchParams }: { searchParams: Promise<{ district?: string }> }) {
  const { district } = await searchParams;
  if (!district || !DISTRICTS.includes(district)) redirect("/plan");
  const alternatives = CATEGORIES.filter((c) => isAvailable(district, c.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm text-red-900 font-semibold mb-2">Step 2 of 4 · Type</p>
      <Link href="/plan" className="text-sm text-red-900">← Change district</Link>
      <h1 className="text-2xl font-bold my-3">What kind of trip in {district}?</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) =>
          isAvailable(district, c.id) ? (
            <Link key={c.id} href={`/plan/days?district=${district}&type=${c.id}`}
              className="rounded-2xl bg-white p-5 shadow-sm border border-transparent hover:border-yellow-500 hover:-translate-y-1 transition">
              <div className="text-3xl">{c.icon}</div>
              <h3 className="font-bold mt-2">{c.label}</h3>
            </Link>
          ) : (
            <div key={c.id} className="rounded-2xl bg-gray-100 p-5 opacity-80">
              <div className="text-3xl grayscale">{c.icon}</div>
              <h3 className="font-bold mt-2">{c.label}</h3>
              <p className="text-sm text-gray-600">Not available in {district}.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {alternatives.slice(0, 3).map((a) => (
                  <Link key={a.id} href={`/plan/days?district=${district}&type=${a.id}`}
                    className="text-xs rounded-full bg-white px-3 py-1 border">
                    Try {a.icon} {a.label}
                  </Link>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}