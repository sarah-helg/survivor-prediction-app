import { put } from "@vercel/blob"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const contestantId = formData.get("contestantId") as string

    if (!file || !contestantId) {
      return NextResponse.json(
        { error: "File and contestant ID are required" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(`contestants/${contestantId}-${file.name}`, file, {
      access: "public",
    })

    // Update contestant with new image URL
    await sql`
      UPDATE contestants 
      SET image_url = ${blob.url}
      WHERE id = ${contestantId}
    `

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Failed to upload image:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
