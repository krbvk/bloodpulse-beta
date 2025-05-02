import { ResendSignIn } from '@/components/Resend/Resend'
import { GoogleSignInButton } from '@/components/GoogleSignin/GoogleSignInButton'
import React from 'react'

const page = () => {
  return (
    <div>
        <ResendSignIn />
        <GoogleSignInButton />
    </div>
  )
}

export default page