import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const userId = formData.get("userId") as string;

    if (!imageFile) {
      return NextResponse.json({ error: "Fotoğraf bulunamadı" }, { status: 400 });
    }

    // Kullanıcı giriş yapmışsa limit kontrolü yap
    if (userId) {
      // Pro kontrolü
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", userId)
        .single();

      const isPro = profile?.is_pro ?? false;

      // Pro değilse günlük limit kontrolü
      if (!isPro) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count } = await supabase
          .from("operations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("type", "remove-bg")
          .gte("created_at", today.toISOString());

        if ((count ?? 0) >= 3) {
          return NextResponse.json({
            error: "Günlük limit doldu! Pro'ya geç → sınırsız kullan.",
            limitReached: true
          }, { status: 429 });
        }
      }
    }

    const removeBgForm = new FormData();
    removeBgForm.append("image_file", imageFile);
    removeBgForm.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": "2sjuWTBrRihcZwvCjKMLxsdU",
      },
      body: removeBgForm,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Remove.bg hatası" }, { status: 500 });
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    return NextResponse.json({ image: base64Image });

  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}