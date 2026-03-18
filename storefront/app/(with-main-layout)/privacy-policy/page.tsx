import BreadCrumb2 from "@/components/global/BreadCrumb2";

function page() {
  return (
    <>
      <BreadCrumb2 pageName="Privacy Policy" />

      <section className="sbp-30">
        <div className="container -mt-40 rounded-xl border border-n30 bg-white p-4 sm:p-4 md:rounded-3xl xl:rounded-[60px] xl:p-15">
          <h2 className="heading-2 text-center">Privacy Policy</h2>

          <div className="stp-15 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="heading-4">Information We Collect</h4>
              <p className="text-n300">
                We may collect personal information that you provide to us when
                you use our Services, such as your name, email address, phone
                number, and payment information. We also collect information
                automatically when you access and use our platform, including
                your IP address, device information, and usage data.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="heading-4">How We Use Your Information</h4>
              <p className="text-n300">
                We use the information we collect to provide, maintain, and
                improve our Services, including processing payments,
                communicating with you, and personalizing your experience. We
                may also use your information to analyze trends, monitor the
                effectiveness of our marketing efforts, and comply with legal
                obligations.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="heading-4">Sharing of Information</h4>
              <p className="text-n300">
                We may share your information with third-party service providers
                who help us operate our platform and provide our Services. We
                may also share your information in response to legal requests or
                to protect our rights, property, or safety. Additionally, we may
                share aggregated or anonymized information that does not
                personally identify you.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="heading-4">Your Choices</h4>
              <p className="text-n300">
                You may choose to limit the collection and use of certain
                information by adjusting your device settings or opting out of
                certain data collection practices. However, please note that
                some features of our Services may not function properly if you
                disable cookies or other tracking mechanisms.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="heading-4">Security</h4>
              <p className="text-n300">
                We take reasonable measures to protect the information we
                collect from loss, misuse, and unauthorized access, disclosure,
                alteration, and destruction. However, no security measures are
                100% effective, so we cannot guarantee the security of your
                information.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="heading-4">Updates to This Policy</h4>
              <p className="text-n300">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of any material changes by posting the updated policy on our
                platform and updating the &quot;Last Updated&quot; date at the
                top of the policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
