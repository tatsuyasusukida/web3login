import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

declare module "iron-session" {
  interface IronSessionData {
    token?: {
      address: string
      nonce: string
      issuedAt: string
    }
    address?: string
  }
}

export function withSession(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, {
    cookieName: process.env.COOKIE_NAME as string,
    password: process.env.COOKIE_PASSWORD as string,
  })
}
