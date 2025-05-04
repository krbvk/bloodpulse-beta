import Navbar from '@/components/Navbar/Homepage'
import React from 'react'
import Options from '@/components/SignInOptions/Options'
import { Box } from '@mantine/core'

const page = () => {
  return (
    <Box>
        <Navbar />
        <Options />
    </Box>
  )
}

export default page