export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return NextResponse.json({ error: "Prompt bulunamadı" }, { status: 400 });

    const response = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        input: { prompt, num_outputs: 1, output_format: "png" }
      })
    });

    const data = await response.json();
    if (data.error) return NextResponse.json({ error: data.error }, { status: 500 });
    if (data.output) return NextResponse.json({ image: Array.isArray(data.output) ? data.output[0] : data.output });
    if (data.id) return NextResponse.json({ predictionId: data.id });

    return NextResponse.json({ error: "Sonuç alınamadı" }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}