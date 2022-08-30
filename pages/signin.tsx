import { ethers } from "ethers";
import { NextPage } from "next";
import { useState } from "react";

async function post(url: string, body: object) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(body),
  })

  return await response.json()
}

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider
  }
}

const Signin: NextPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const onClick = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])

    const signer = provider.getSigner()
    const address = await signer.getAddress()
    const {message} = await post('/api/message', {address})
    const signature = await signer.signMessage(message)
    
    const {ok} = await post('/api/signin', {message, signature})
    setIsAuthenticated(ok)
  }

  return (
    <main>
      <h1>Web3 Login </h1>
      <button onClick={onClick}>Signin</button>
      {isAuthenticated && (
        <p>Sign in completed</p>
      )}
    </main>
  )
}

export default Signin
