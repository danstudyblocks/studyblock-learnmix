import LinkButton from "@/components/ui/LinkButton"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-center justify-between mb-5">
      <div>
        <h5 className="heading-5">
          Already have an account?
        </h5>
        <p className="block list-inside list-disc pt-3 text-lg text-n300 marker:text-[10px] marker:text-n900">
          Sign in for a better experience.
        </p>
      </div>
      <div className="text-sm text-white">
        <LinkButton link="/sign-in" text="Sign in" isBlue={true} />
      </div>
    </div>
  )
}

export default SignInPrompt
