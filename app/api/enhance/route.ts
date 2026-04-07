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
      "https://api-inference.huggingface.co/models/caidas/swin2SR-realworld-sr-x4-64-bsrgan-psnr",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": imageFile.type,
        },
        body: imageBuffer,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: "HF hatası: " + errText }, { status: 500 });
    }

    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString("base64");

    return NextResponse.json({ image: `data:image/png;base64,${resultBase64}` });

  } catch (err) {
    return NextResponse.json({ error: "Sunucu hatası: " + (err as Error).message }, { status: 500 });
  }
}