import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt bulunamadı" }, { status: 400 });
    }

    const response = await fetch("https://api.replicate.com/v1/models/minimax/video-01/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          prompt_optimizer: true
        }
      })
    });

    const data = await response.json();

    if (data.output) {
      return NextResponse.json({ video: data.output });
    }

    if (data.id) {
      return NextResponse.json({ predictionId: data.id });
    }

    return NextResponse.json({ error: "Video oluşturulamadı" }, { status: 500 });

  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}