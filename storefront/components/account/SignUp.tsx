"use client";
import LeftSideSlider from "@/components/authentication/LeftSideSlider";
import facebook from "@/public/images/facebook_icon.png";
import google from "@/public/images/google_icon.png";
import logo from "@/public/images/logo.png";
import icon2 from "@/public/images/victor_icon.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  PiEnvelopeSimple,
  PiLock,
  PiUser,
} from "react-icons/pi";

import ErrorMessage from "@modules/checkout/components/error-message"
import { useRouter } from "next/navigation";

interface SignUp {
  signup: (_currentState: unknown, formData: FormData) => Promise<void>;
}

function SignUp({ signup }: SignUp) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget); 
    try {
      await signup(null, formData);
      setIsLoading(false);
      // Use window.location for full page reload to ensure cookies are set
      window.location.href = "/";
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message);
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
            <form className="flex w-full flex-col pt-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3 bg-transparent">
                  <span className="text-2xl !leading-none">
                    <PiUser />
                  </span>
                  <input
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    required
                    autoComplete="given-name"
                    data-testid="first-name-input"
                    className="w-full text-sm text-n300 outline-none bg-transparent"
                  />
                </div>
                <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3 bg-transparent">
                  <span className="text-2xl !leading-none">
                    <PiUser />
                  </span>
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    required
                    autoComplete="family-name"
                    data-testid="last-name-input"
                    className="w-full text-sm text-n300 outline-none bg-transparent"
                  />
                </div>
                <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3 bg-transparent">
                  <span className=" text-2xl !leading-none">
                    <PiEnvelopeSimple />
                  </span>
                  <input
                    placeholder="Enter Your Email"
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    data-testid="email-input"
                    className="w-full text-sm text-n300 outline-none bg-transparent"
                  />
                </div>
                <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3 bg-transparent">
                  <span className=" text-2xl !leading-none">
                    <PiEnvelopeSimple />
                  </span>
                  <input
                    placeholder="Enter Your Phone"
                    name="phone"
                    required
                    type="tel"
                    autoComplete="phone"
                    data-testid="phone-input"
                    className="w-full text-sm text-n300 outline-none bg-transparent"
                  />
                </div>
                <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3 bg-transparent">
                  <span className="text-2xl !leading-none">
                    <PiLock />
                  </span>
                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    name="password"
                    required
                    autoComplete="new-password"
                    data-testid="password-input"
                    className="w-full text-sm text-n300 outline-none bg-transparent"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="flex items-center justify-start gap-2 rounded-md border border-r300 bg-r100/10 px-4 py-3 text-sm text-r300"
                  >
                    <span className="font-medium">Error:</span> {error}
                  </div>
                )}
                <span
                  className="block w-full max-w-md mx-auto text-center text-ui-fg-base text-small-regular mt-6 text-n300"
                >
                  By creating an account, you agree to Learnmix&apos;s{" "}
                  <Link href="/privacy-policy" className="underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms-conditions" className="underline">
                    Terms of Use
                  </Link>
                  .
                </span>

              </div>

              <div className="w-full">
                <Link
                  href="/contact"
                  className="block py-3 text-end text-sm font-medium text-n300"
                >
                  Forgot Password?
                </Link>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl px-4 py-3 font-semibold text-white duration-700 ${isLoading
                    ? "bg-b200 cursor-not-allowed"
                    : "bg-b300 hover:bg-b400"
                    }`}
                >
                  {isLoading ? (
                    <span className="loader-spinner h-5 w-5 border-2 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </button>


              </div>
              <div className="flex items-center justify-center gap-2 py-3 text-sm font-medium">
                <p className="text-n300">Already have an account?</p>
                <Link href="/sign-in" className="text-b300 underline">
                  Sign in here
                </Link>
              </div>

              {/* <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 bg-white py-3">
                <Image src={google} alt="" />
                <span className="text-sm">Google</span>
              </button>

              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-n30 bg-white py-3">
                <Image src={facebook} alt="" />
                <span className="text-sm">Facebook</span>
              </button> */}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignUp;
