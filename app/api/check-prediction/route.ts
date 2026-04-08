import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  
  const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: {
      "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`
    }
  });
  
  const data = await res.json();
  return NextResponse.json(data);
}