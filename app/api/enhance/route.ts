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

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/caidas/swin2SR-realworld-sr-x4-large-PSNR-DF2K-s64w8-SwinIR-M-x4-GAN",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": imageFile.type,
        },
        body: imageBuffer,
      }
    );

    console.log("Status:", response.status);
    console.log("Content-Type:", response.headers.get("content-type"));

    if (!response.ok) {
      const txt = await response.text();
      console.log("Error:", txt);
      return NextResponse.json({ error: txt }, { status: 500 });
    }

    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString("base64");
    const contentType = response.headers.get("content-type") || "image/png";
    const dataUrl = `data:${contentType};base64,${resultBase64}`;

    return NextResponse.json({ image: dataUrl });

  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}