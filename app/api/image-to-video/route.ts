import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Resim bulunamadı" }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const blob = new Blob([bytes], { type: imageFile.type });

    const hfForm = new FormData();
    hfForm.append("inputs", blob, imageFile.name);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        body: hfForm,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("HF Error:", errText);
      return NextResponse.json({ error: "Video oluşturulamadı: " + errText }, { status: 500 });
    }

    const videoBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(videoBuffer).toString("base64");
    const videoUrl = `data:video/mp4;base64,${base64}`;

    return NextResponse.json({ video: videoUrl });

  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}