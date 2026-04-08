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
        version: "632d1e72b2f64b39dada5c770bc2f24ee3e3d3a9e35ae1fd1b1726e6ffca872f",
        input: { image: dataUrl }
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