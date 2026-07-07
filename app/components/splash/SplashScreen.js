"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 3000); // Navigate after 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8F8FF] flex flex-col items-center justify-between py-16">

      {/* Logo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "linear",
        }}
        className="mt-10"
      >
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={180}
          height={180}
          priority
        />
      </motion.div>

      {/* Bottom Loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      >
        <div className="w-16 h-16 rounded-full bg-[#4338CA] flex items-center justify-center">
          <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full"></div>
        </div>
      </motion.div>

    </div>
  );
}