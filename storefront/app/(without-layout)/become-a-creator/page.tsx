//@ts-nocheck
"use client";
import LinkButton from "@/components/ui/LinkButton";
import logo from "@/public/images/logo.png";
import icon2 from "@/public/images/victor_icon.png";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PiBriefcase,
  PiEnvelopeSimple,
  PiImage,
  PiLinkedinLogo,
  PiLock,
  PiMapPin,
  PiUser,
} from "react-icons/pi";
import { createVendor, registerVendorAdmin } from "@/lib/data/vendor";

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

function BecomeACreatorPage() {
  const [loginStep, setLoginStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [jwtToken, setJwtToken] = useState(null);
  const [fileName, setFileName] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    admin: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
    },
    logo: null,
    handle: "",
  });

  const handleInputChange = (e, key, subKey = null) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData((prev) => {
      if (subKey) {
        return { ...prev, [key]: { ...prev[key], [subKey]: value } };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const registerAdmin = async () => {
    try {
      const adminPayload = {
        email: formData.admin.email,
        password: formData.admin.password,
      };
  
      // Pass adminPayload to registerVendorAdmin
      const authResponse = await registerVendorAdmin(adminPayload);
  
      if (authResponse.success) {
        // Move to next step after successful admin registration
        setLoginStep(2);
        setErrorMessage("");
      } else {
        console.error("Error:", authResponse.error || "Unknown error occurred");
        setErrorMessage(authResponse.error || "Failed to register admin.");
      }
    } catch (error) {
      console.error("Admin Registration Error:", error);
      setErrorMessage("Failed to register admin. Please check your details.");
    }
  };
  

  const registerVendor = async () => {

    try {
      const vendorPayload = {
        name: formData.name,
        handle: formData.handle,
        // logo: formData.logo,
        admin: {
          email: formData.admin.email,
          first_name: formData.admin.first_name,
          last_name: formData.admin.last_name,
        },
      };

      let password = formData.admin.password;

      const vendorResponse = await createVendor(vendorPayload, password)

      if (vendorResponse.success === true) {
        setSuccessMessage("Studyblocks Creator created successfully! Welcome to StudyBlocks.");
        router.push("/dashboard/home"); // Redirect on successful 
      } else {
        setSuccessMessage(
          `Vendor creation completed with status: ${vendorResponse.status}. Please verify your details.`
        );
      }
    } catch (error) {
      console.error("Vendor Registration Error:", error);
      setErrorMessage("Failed to create vendor. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (loginStep === 1) {
      await registerAdmin();
    } else if (loginStep === 2) {
      await registerVendor();
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="flex h-full items-center justify-center lg:mt-28">
        <div className="col-span-12 flex flex-col items-start justify-center lg:col-span-5 xl:col-start-8">
          <h5 className="heading-5 text-r300">Study Blocks</h5>
          <h2 className="heading-2 max-w-[600px] pt-4">
            Become a StudyBlocks creator today and receive free professional design, AI enhancements, a fully managed marketplace service, industry-leading commission rates, exclusive print-on-demand services and access to a worldwide community of educators.
          </h2>
          <div className="text-sm text-white mt-5">
            <LinkButton link="/contact" text="Know More About" isBlue={true} />
          </div>
        </div>
        <div className="flex h-full w-full max-w-[530px] flex-col items-start justify-start max-lg:px-6 max-lg:pt-40 max-sm:pt-32 lg:ml-20 xl:max-w-[380px] xxl:max-w-[530px] 3xl:ml-40">
          <Link href="/">
            <Image src={logo} alt="Logo" />
          </Link>

          {successMessage ? (
            <div className="mt-4 p-4 text-green-600 bg-green-100 rounded-md">
              {successMessage}
            </div>
          ) : errorMessage ? (
            <div className="mt-4 p-4 text-red-600 bg-red-100 rounded-md">
              {errorMessage}
            </div>
          ) : (
            <>
              {loginStep === 1 && (
                <>
                  <div className="flex items-center justify-start pt-8">
                    <p className="heading-5">Become a StudyBlocks creator</p>
                    <Image src={icon2} alt="Icon" />
                  </div>
                  <form className="flex w-full flex-col pt-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                        <span className="text-2xl !leading-none">
                          <PiUser />
                        </span>
                        <input
                          type="text"
                          placeholder="Enter Your First Name"
                          value={formData.admin.first_name}
                          onChange={(e) => handleInputChange(e, "admin", "first_name")}
                          className="w-full text-sm text-n300 outline-none"
                        />
                      </div>
                      <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                        <span className="text-2xl !leading-none">
                          <PiUser />
                        </span>
                        <input
                          type="text"
                          placeholder="Enter Your Last Name"
                          value={formData.admin.last_name}
                          onChange={(e) => handleInputChange(e, "admin", "last_name")}
                          className="w-full text-sm text-n300 outline-none"
                        />
                      </div>
                      <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                        <span className=" text-2xl !leading-none">
                          <PiEnvelopeSimple />
                        </span>
                        <input
                          type="email"
                          placeholder="Enter Your Email"
                          value={formData.admin.email}
                          onChange={(e) => handleInputChange(e, "admin", "email")}
                          className="w-full text-sm text-n300 outline-none"
                        />
                      </div>
                      <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                        <span className="text-2xl !leading-none">
                          <PiLock />
                        </span>
                        <input
                          type="password"
                          placeholder="Enter Your Password"
                          value={formData.admin.password}
                          onChange={(e) => handleInputChange(e, "admin", "password")}
                          className="w-full text-sm text-n300 outline-none"
                        />
                      </div>
                    </div>
                  </form>
                </>
              )}

              {loginStep === 2 && (
                <form className="flex w-full flex-col pt-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiBriefcase />
                      </span>
                      <input
                        type="text"
                        placeholder="Business Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange(e, "name")}
                        className="w-full text-sm text-n300 outline-none"
                      />
                    </div>
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiMapPin />
                      </span>
                      <input
                        type="text"
                        placeholder="Business Handle"
                        value={formData.handle}
                        onChange={(e) => handleInputChange(e, "handle")}
                        className="w-full text-sm text-n300 outline-none"
                      />
                    </div>
                    <div className="flex w-full items-center justify-start gap-3 rounded-2xl border border-n30 px-4 py-3">
                      <span className="text-2xl !leading-none">
                        <PiImage />
                      </span>
                      <div className="w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="fileInput"
                        />
                        <label
                          htmlFor="fileInput"
                          className="w-full text-sm text-n300 outline-none cursor-pointer"
                        >
                          {fileName || "Choose Business Logo"}
                        </label>
                      </div>
                    </div>

                  </div>
                </form>
              )}

              <button
                onClick={handleSubmit}
                className="w-full rounded-xl bg-b300 px-4 py-3 text-white mt-4"
              >
                {loginStep < 2 ? "Continue" : "Submit"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default BecomeACreatorPage;