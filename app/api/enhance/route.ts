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
    const blob = new Blob([imageBuffer], { type: imageFile.type });

    const hfForm = new FormData();
    hfForm.append("inputs", blob, imageFile.name);

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/caidas/swin2SR-classical-sr-x2-64",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        body: hfForm,
      }
    );

    const responseText = await response.text();
    console.log("HF Status:", response.status);
    console.log("HF Response:", responseText);

    if (!response.ok) {
      return NextResponse.json({ error: "Hata " + response.status + ": " + responseText }, { status: 500 });
    }

    const imageData = Buffer.from(responseText, "binary");
    const base64 = imageData.toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({ image: dataUrl });

  } catch (err) {
    return NextResponse.json({ error: "Sunucu hatası: " + (err as Error).message }, { status: 500 });
  }
}