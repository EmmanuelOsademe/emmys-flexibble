import {getServerSession} from 'next-auth/next';
import {NextAuthOptions, User} from 'next-auth';
import {AdapterUser} from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import jsonwebtoken from 'jsonwebtoken';
import {JWT} from 'next-auth/jwt';
import { SessionInterface, UserProfile } from '@/common.types';
import { createUser, getUser } from './actions';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        })
    ],
    jwt: {
        encode: ({secret, token}) => {
            const encodedToken = jsonwebtoken.sign({
                ...token,
                iss: "grafbase",
                exp: Math.floor(Date.now() /1000) + 60 * 60
            }, secret)
            return encodedToken;
        },
        decode: ({secret, token}) => {
            const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;
            return decodedToken;
        }
    },
    theme: {
        colorScheme: 'light',
        logo: '/logo.svg'
    },
    callbacks: {
        async session({session}){
           try {
                const email = session?.user?.email as string;
                const data = await getUser(email) as {user?: UserProfile};
                const newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        ...data?.user
                    }
                }

                return newSession;
           } catch (e: any) {
                console.log("Error retrieving user data", e.message);
                return session;
           }
        },
        async signIn({user}: {user: AdapterUser | User}){
            try {
                // Get the user if exists
                const userExists = await getUser(user?.email as string) as {user?: UserProfile};

                // create if the user does not exist
                if(!userExists.user){
                    await createUser(user.email as string, user.name as string, user.image as string);
                }

                return true;
            } catch (e: any) {
                console.log(e.message);
                return false;
            }
        }
    }
}

export async function getCurrentUser(){
    try {
        const session = await getServerSession(authOptions) as SessionInterface
        return session;
    } catch (e:any) {
        console.log(e.message);
    }
}