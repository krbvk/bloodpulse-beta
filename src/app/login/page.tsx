'use client';

import Navbar from '@/components/Navbar/Homepage';
import Options from '@/components/SignInOptions/Options';
import { Box } from '@mantine/core';

export default function LoginPage() {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box
        style={{
          minHeight: '100vh',
          paddingTop: 65,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to right, #fdecea, #fff)',
        }}
      >
        <Options />
      </Box>
    </Box>
  );
}
