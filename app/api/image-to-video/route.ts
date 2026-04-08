import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Resim bulunamadı" }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${imageFile.type};base64,${base64}`;

    const response = await fetch(
      "https://router.huggingface.co/fal-ai/stable-video-diffusion",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: dataUrl,
          motion_bucket_id: 127,
          fps: 25,
        }),
      }
    );

    const data = await response.json();
    console.log("HF Response:", JSON.stringify(data));

    if (data.video?.url) {
      return NextResponse.json({ video: data.video.url });
    }

    if (data.url) {
      return NextResponse.json({ video: data.url });
    }

    return NextResponse.json({ error: "Video oluşturulamadı: " + JSON.stringify(data) }, { status: 500 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}