export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const style = formData.get("style") as string;

    if (!imageFile) return NextResponse.json({ error: "Resim bulunamadı" }, { status: 400 });

    const imageBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");
    const dataUrl = `data:${imageFile.type};base64,${base64}`;

    const modelVersion = style === "anime"
      ? "9222a21c181b707209ef12b5e0d7e94310a0d9b2131fa238d5f5b1d1b8a02be"
      : "2861e5c6a1cd499c1f1f58f64b09eba55e9e2c76e57d68edd7a3b1ea544b9b9";

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: modelVersion,
        input: { image: dataUrl }
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