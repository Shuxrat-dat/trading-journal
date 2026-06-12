import { getServerSession } from "next-auth";

export async function getCurrentUserId() {
  const session = await getServerSession();

  if (!session?.user) {
    return null;
  }

  return (session.user as any).id;
}