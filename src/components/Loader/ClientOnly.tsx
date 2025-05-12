'use client';


import { useState, useEffect } from 'react';
import CustomLoader from '@/components/Loader/CustomLoader';

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Set mounted to true after the component is mounted
  }, []);

  if (!mounted) {
    return <CustomLoader />; // Show the loader until the component is mounted
  }

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #fdecea, #fff)", // Apply the gradient here
        backgroundSize: "cover", // Ensure the background covers the element
        padding: "20px", // Optional: Add some padding if needed
      }}
    >
      {children}
    </div>
  );
}
