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

    // Önce prediction oluştur
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
        input: {
          input_image: dataUrl,
          motion_bucket_id: 127,
          fps: 25,
          decoding_t: 14,
          sizing_strategy: "maintain_aspect_ratio"
        }
      })
    });

    const data = await response.json();
    console.log("Replicate response:", JSON.stringify(data));

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    if (data.output && data.output[0]) {
      return NextResponse.json({ video: data.output[0] });
    }

    if (data.id) {
      return NextResponse.json({ predictionId: data.id });
    }

    return NextResponse.json({ error: "Video oluşturulamadı" }, { status: 500 });

  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}