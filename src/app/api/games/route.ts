import { NextResponse } from "next/server";
import { GameService } from "@/services/games/GameService";

export async function GET() {
  try {
    const games = await GameService.getAllGames();
    return NextResponse.json({ games });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao listar jogos" }, { status: 500 });
  }
}
