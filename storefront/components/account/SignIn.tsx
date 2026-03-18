"use client";

import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import { PiEnvelopeSimple, PiLock } from "react-icons/pi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LeftSideSlider from "@/components/authentication/LeftSideSlider";
import facebook from "@/public/images/facebook_icon.png";
import google from "@/public/images/google_icon.png";
import logo from "@/public/images/logo.png";
import icon2 from "@/public/images/victor_icon.png";

interface SignIn {
  login: (_currentState: unknown, formData: FormData) => Promise<void>;
}

function SignIn({ login }: SignIn) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await login(null, formData); 
      setIsLoading(false); 
      // Use window.location for full page reload to ensure cookies are set
      window.location.href = "/";
    } catch (error: any) {
      setIsLoading(false); // Hide loading state
      setError(error.message); // Display the error message
    }
  };

  return (
    <>
      <section className="relative overflow-hidden min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#FCFAF8]">
        <div className="flex h-full items-center justify-center max-lg:justify-center py-8">
          <div className="flex flex-col items-start justify-start max-lg:px-6">
            <div className="flex items-center justify-center w-full pt-8">
              <p className="heading-5">Welcome to Learnmix</p>
              <Image src={icon2} alt="" />
            </div>
            <form className="flex w-full lg:w-[28rem] flex-col pt-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* Email Input */}
                <div className="flex w-full items-center gap-3 rounded-2xl border border-n30 px-4 py-3 focus-within:border-b300 bg-transparent">
                  <span className="text-2xl !leading-none text-n300">
                    <PiEnvelopeSimple />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter Your Email"
                    name="email"
                    title="Enter a valid email address."
                    autoComplete="email"
                    required
                    className="w-full text-sm text-n300 outline-none bg-transparent"
                  />
                </div>

                {/* Password Input */}
                <div className="flex w-full items-center gap-3 rounded-2xl border border-n30 px-4 py-3 focus-within:border-b300 bg-transparent">
                  <span className="text-2xl !leading-none text-n300">
                    <PiLock />
                  </span>
                  <input
                    type="password"
                    placeholder="*******"
                    name="password"
                    autoComplete="current-password"
                    required
                    className="w-full text-sm text-n300 outline-none bg-transparent"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-center justify-start gap-2 rounded-md border border-r300 bg-r100/10 px-4 py-3 text-sm text-r300"
                  >
                    <span className="font-medium">Error:</span> {error}
                  </div>
                )}
              </div>

              {/* Forgot Password */}
              <div className="w-full">
                <Link
                  href="/contact"
                  className="block py-3 text-end text-sm font-medium text-n300"
                >
                  Forgot Password?
                </Link>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl px-4 py-3 font-semibold text-white duration-700 ${
                    isLoading
                      ? "bg-b200 cursor-not-allowed"
                      : "bg-b300 hover:bg-b400"
                  }`}
                >
                  {isLoading ? (
                    <span className="loader-spinner h-5 w-5 border-2 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="flex items-center justify-center gap-2 py-3 text-sm font-medium">
                  <p className="text-n300">Don’t have an account?</p>
                  <Link href="/sign-up" className="text-b300 underline">
                    Sign Up with Email
                  </Link>
                </div>

                {/* Social Buttons */}
                {/* <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 py-3">
                  <Image src={google} alt="Google Icon" />
                  <span className="text-sm">Google</span>
                </button>
                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 py-3">
                  <Image src={facebook} alt="Facebook Icon" />
                  <span className="text-sm">Facebook</span>
                </button> */}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignIn;
