import crypto from "crypto";
import { NextApiHandler } from "next";
import { withSession } from "../../lib/with-session";

const apiMessage: NextApiHandler = async (req, res) => {
  const {address} = req.body
  const nonce = crypto.randomUUID()
  const issuedAt = new Date().toISOString()
  const token = {address, nonce, issuedAt}
  const message = [
    `Welcome to XxxxXxx!`,
    ``,
    `Click to sign in and accept the XxxxXxx Terms of Service: https://xxxxxxx.io/tos`,
    ``,
    `This request will not trigger a blockchain transaction or cost any gas fees.`,
    ``,
    `Your authentication status will reset after 24 hours.`,
    ``,
    `Wallet address:`,
    `${token.address}`,
    ``,
    `Nonce:`,
    `${token.nonce}`,
  ].join('\n')

  req.session.token = token
  await req.session.save()

  res.send({message})
}

export default withSession(apiMessage)
