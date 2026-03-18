import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  response.cookies.delete("genz_token");
  return response;
}
