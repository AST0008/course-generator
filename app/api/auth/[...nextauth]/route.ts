import { authoptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authoptions);

console.log("ENV | NEXTAUTH_SECRET:", process.env.DATABASE_URL);

export { handler as GET, handler as POST };