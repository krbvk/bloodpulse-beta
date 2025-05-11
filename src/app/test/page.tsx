"use client";

import React, { useState, useEffect } from 'react';
import CustomLoader from "@/components/Loader/CustomLoader"; 

const Page = () => {
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
  }, []);

  return <CustomLoader />;
};

export default Page;
