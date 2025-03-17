import { NextAuthOptions, DefaultSession } from "next-auth";
import { prisma } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            credits: number;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        credits: number;
    }
}

export const authoptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks:{
        jwt: async ({ token} ) =>{
            const db_user = await prisma.user.findFirst({
                where: {
                    email: token.email as string
                }
            })
            if(db_user){

                token.id = db_user.id
                token.credits = db_user.credits
            }
            return token
        },
        session: ({ session, token }) => {
            if(token){
                session.user.id = token.id as string
                session.user.credits = token.credits as number
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.image = token.picture as string
            }
            return session
        },
        secret: process.env.NEXTAUTH_SECRET as string,
        adapter: PrismaAdapter(prisma),
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            }),
        ]
    
    }
}