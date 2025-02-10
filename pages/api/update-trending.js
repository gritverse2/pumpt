import { NextResponse } from "next/server";
import axios from "axios";

export const config = {
  runtime: "edge",
};

export default async function handler(req, res) {
  try {
    await axios.get("https://your-vercel-url.vercel.app/api/trending");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
