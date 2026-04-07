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

    const response = await fetch("https://api.replicate.com/v1/models/nightmareai/real-esrgan/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          image: dataUrl,
          scale: 4,
          face_enhance: false,
        }
      }),
    });

    const prediction = await response.json();
    
    // Sonucu bekle
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(r => setTimeout(r, 1000));
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}` }
      });
      result = await poll.json();
    }

    if (result.status === "failed") {
      return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
    }

    return NextResponse.json({ image: result.output });

  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}