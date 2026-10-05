import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { CATEGORIES, DISTRICTS, getCrowd } from "@/lib/data";

export const maxDuration = 60;

function fallback(district: string, days: number) {
  const times = ["06:00", "08:00", "10:00", "12:30", "15:00", "17:30", "19:30"];
  return {
    days: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1} in ${district}`,
      slots: times.map((time) => ({
        time,
        place: `Explore ${district}`,
        description: "Enjoy local sights, food and culture.",
        travel_tip: "Use a local taxi, auto or state bus. Start early to avoid crowds.",
      })),
    })),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { district, category } = body;
    const days = Math.min(7, Math.max(1, Number(body.days) || 1));

    if (!DISTRICTS.includes(district) || !CATEGORIES.some((c) => c.id === category)) {
      return NextResponse.json({ error: "Invalid district or type" }, { status: 400 });
    }
    const start = body.date ? new Date(body.date) : new Date();
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    let itinerary: any;
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const r = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are an expert Tamil Nadu travel planner. Output valid JSON only." },
          {
            role: "user",
            content: `Create a ${days}-day ${category} itinerary for ${district} district, Tamil Nadu, India.
Use real, well-known places. Each day runs 06:00 to 21:00 with 7-9 slots (include meals, rest, travel).
Return ONLY JSON: {"days":[{"day":1,"title":"...","slots":[{"time":"06:00","place":"...","description":"1-2 sentences","travel_tip":"how to get there, duration, transport"}]}]}`,
          },
        ],
      });
      itinerary = JSON.parse(r.choices[0].message.content ?? "{}");
      if (!Array.isArray(itinerary.days) || !itinerary.days.length) throw new Error("bad shape");
    } catch (e) {
      console.error("OpenAI failed, using fallback:", e);
      itinerary = fallback(district, days);
    }

    itinerary.days.forEach((day: any, i: number) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      day.date = d.toISOString().slice(0, 10);
      day.slots = (day.slots ?? []).map((s: any) => ({
        ...s,
        crowd: getCrowd(d, parseInt(String(s.time).split(":")[0], 10) || 9),
      }));
    });

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data, error } = await supabase
      .from("plans")
      .insert({ district, category, days, travel_date: start.toISOString().slice(0, 10), itinerary })
      .select("id")
      .single();

    if (error || !data) {
      console.error(error);
      return NextResponse.json({ error: "Could not save plan. Check Supabase keys." }, { status: 500 });
    }
    return NextResponse.json({ id: data.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unexpected error. Please try again." }, { status: 500 });
  }
}