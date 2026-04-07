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
    const imageBlob = new Blob([imageBuffer], { type: imageFile.type });

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
            image: `data:${imageFile.type};base64,${Buffer.from(imageBuffer).toString("base64")}`,
            scale: 2,
            face_enhance: false,
          }
        }),
      }
    );

    const result = await response.json();

    if (result.output) {
      return NextResponse.json({ image: result.output });
    }

    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });

  } catch (err) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}