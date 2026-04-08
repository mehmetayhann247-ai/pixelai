export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    if (!imageFile) return NextResponse.json({ error: "Resim bulunamadı" }, { status: 400 });

    const imageBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");
    const dataUrl = `data:${imageFile.type};base64,${base64}`;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        version: "9283608cc6b7be6b65a8e44983db012355f829a539ad21d6351c0e4f8b8e3c5",
        input: { img: dataUrl, version: "v1.4", scale: 2 }
      })
    });

    const data = await response.json();
    if (data.error) return NextResponse.json({ error: data.error }, { status: 500 });
    if (data.output) return NextResponse.json({ image: data.output });
    if (data.id) return NextResponse.json({ predictionId: data.id });

    return NextResponse.json({ error: "Sonuç alınamadı" }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}