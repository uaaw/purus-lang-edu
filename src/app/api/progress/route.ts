import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await prisma.progress.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(progress);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { lessonId, completed, code } = body;

  if (!lessonId) {
    return NextResponse.json(
      { error: "lessonId is required" },
      { status: 400 }
    );
  }

  const progress = await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    update: {
      completed: completed ?? undefined,
      code: code ?? undefined,
    },
    create: {
      userId: session.user.id,
      lessonId,
      completed: completed ?? false,
      code: code ?? "",
    },
  });

  return NextResponse.json(progress);
}
