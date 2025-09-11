import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export async function GET() {
  const filePath = path.join(process.cwd(), "casas.json")
  const jsonData = await fs.readFile(filePath, "utf-8")
  const casas = JSON.parse(jsonData).filter((casa:any) => typeof casa.id !== "undefined")
  return NextResponse.json(casas)
}
