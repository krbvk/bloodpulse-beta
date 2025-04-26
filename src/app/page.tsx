"use client";

import HomePageCarousel from "@/components/Carousel/Homepage";
import { SignIn } from "@/components/GoogleSignin/GoogleSignInButton";
import Navbar from "@/components/Navbar/Homepage";

export default function Page() {
  return (
    <div>
      <Navbar />
      <HomePageCarousel />
      {/* <SignIn /> */}
    </div>
  );
}
