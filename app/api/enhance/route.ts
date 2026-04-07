export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Fotoğraf bulunamadı" }, { status: 400 });
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");
    const dataUrl = `data:${imageFile.type};base64,${base64}`;

    const response = await fetch(
      "https://router.huggingface.co/replicate/models/nightmareai/real-esrgan/predictions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            image: dataUrl,
            scale: 2,
            face_enhance: false,
          }
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "HF hatası: " + JSON.stringify(result) }, { status: 500 });
    }

    if (result.output) {
      return NextResponse.json({ image: result.output });
    }

    return NextResponse.json({ error: "Sonuç yok: " + JSON.stringify(result) }, { status: 500 });

  } catch (err) {
    return NextResponse.json({ error: "Sunucu hatası: " + (err as Error).message }, { status: 500 });
  }
}