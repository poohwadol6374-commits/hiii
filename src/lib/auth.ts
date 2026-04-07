import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
    newUser: "/onboarding",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo mode: accept any email + password
        if (!credentials?.email) {
          return null;
        }

        return {
          id: "demo-user-001",
          email: credentials.email,
          name: credentials.email.split("@")[0] || "Demo User",
          image: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.hasCompletedOnboarding = false;
        token.locale = "th";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) ?? "demo-user-001";
        session.user.hasCompletedOnboarding =
          (token.hasCompletedOnboarding as boolean) ?? false;
        session.user.locale = (token.locale as string) ?? "th";
      }
      return session;
    },
  },
};
