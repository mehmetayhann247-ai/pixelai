export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Fotoğraf bulunamadı" }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = imageFile.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Prediction oluştur
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
        input: {
          image: dataUrl,
          scale: 2,
          face_enhance: false,
        }
      }),
    });

    const prediction = await createRes.json();

    if (!prediction.id) {
      return NextResponse.json({ error: "Model başlatılamadı" }, { status: 500 });
    }

    // Sonucu bekle — max 55 saniye
    let result = prediction;
    const startTime = Date.now();
    
    while (result.status !== "succeeded" && result.status !== "failed") {
      if (Date.now() - startTime > 55000) {
        return NextResponse.json({ error: "Zaman aşımı — tekrar dene" }, { status: 408 });
      }
      await new Promise(r => setTimeout(r, 2000));
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}` }
      });
      result = await poll.json();
    }

    if (result.status === "failed") {
      return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
    }

    return NextResponse.json({ image: result.output });

  } catch (err) {
    return NextResponse.json({ error: "Sunucu hatası: " + err }, { status: 500 });
  }
}