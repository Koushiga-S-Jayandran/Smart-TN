import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { festivalOn } from "@/lib/data";

const BADGE: Record<string, string> = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
};

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let plan: any = null;
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data } = await supabase.from("plans").select("*").eq("id", id).maybeSingle();
    plan = data;
  } catch {}

  if (!plan) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">We couldn’t find that plan</h1>
        <Link href="/plan" className="inline-block mt-6 rounded-full bg-red-900 text-white px-6 py-3">
          Plan a new trip
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">
        {plan.days}-day {plan.category} trip · {plan.district}
      </h1>
      <p className="text-gray-600">Starting {plan.travel_date}</p>

      {plan.itinerary.days.map((day: any) => {
        const fest = day.date ? festivalOn(new Date(day.date)) : null;
        return (
          <section key={day.day} className="mt-8">
            <h2 className="text-xl font-bold text-red-900">Day {day.day}: {day.title}</h2>
            <p className="text-xs text-gray-500">{day.date} {fest && `· 🎉 ${fest}, expect larger crowds`}</p>
            <ol className="mt-3 border-l-2 border-yellow-500/50 pl-5 space-y-4">
              {day.slots.map((s: any, i: number) => (
                <li key={i} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex justify-between items-center gap-2">
                    <span className="rounded-full bg-red-900 text-white text-xs px-3 py-1">{s.time}</span>
                    {s.crowd && (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE[s.crowd]}`}>
                        {s.crowd} crowd
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mt-2">{s.place}</h3>
                  <p className="text-sm text-gray-600">{s.description}</p>
                  <p className="text-xs text-teal-700 mt-2">🚗 {s.travel_tip}</p>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      <Link href="/plan" className="inline-block mt-10 rounded-full bg-red-900 text-white px-6 py-3">
        Plan another trip
      </Link>
    </div>
  );
}