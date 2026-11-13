import { connection } from "next/server";
import { checkSystemConnectionsAction } from "@/lib/actions";

export async function GET() {
  await connection();
  const result = await checkSystemConnectionsAction();
  return Response.json(
    {
      ...result,
      database: "sqlite (prisma)",
      checkedAt: new Date().toISOString(),
    },
    { status: result.ok ? 200 : 500 }
  );
}
