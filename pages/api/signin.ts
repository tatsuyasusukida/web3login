import crypto from "crypto";
import { ethers } from "ethers";
import { NextApiHandler } from "next";
import { withSession } from "../../lib/with-session";

const apiSignin: NextApiHandler = async (req, res) => {
  const {token} = req.session

  if (!token) {
    res.send({ok: false})
    return
  }

  const {message, signature} = req.body
  const lines = message.split('\n')
  const nonce = lines[lines.length - 1]

  const digest = ethers.utils.hashMessage(message)
  const expected = ethers.utils.recoverAddress(digest, signature)
  const issuedAt = new Date(token.issuedAt).getTime()

  const ok = token.address === expected
    && nonce === token.nonce
    && Date.now() < issuedAt + 15 * 60 * 1000

  if (ok) {
    req.session.address = token.address
    delete req.session.token
    await req.session.save()
  }

  res.send({ok})
}

export default withSession(apiSignin)
