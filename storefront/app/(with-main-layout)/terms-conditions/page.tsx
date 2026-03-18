import BreadCrumb2 from "@/components/global/BreadCrumb2";

function page() {
  return (
    <>
      <BreadCrumb2 pageName="Terms & Condition" />

      <section className="sbp-30">
        <div className="container -mt-40 rounded-xl border border-n30 bg-white p-4 sm:p-4 md:rounded-3xl xl:rounded-[60px] xl:p-15">
          <h2 className="heading-2 text-center">Terms & Condition</h2>

          <ol className="stp-15 flex list-inside list-decimal flex-col gap-8">
            <li className="marker:heading-4">
              <span className="heading-4">Introduction</span>
              <ul className="block list-inside list-disc pt-3 text-lg text-n300 marker:text-[10px] marker:text-n900">
                <li>
                  Welcome to Servibe These terms and conditions govern your use
                  of our website and services. By accessing or using our website
                  and services, you agree to comply with these terms and
                  conditions.
                </li>
              </ul>
            </li>
            <li className="marker:heading-4">
              <span className="heading-4">User Agreement</span>
              <ul className="block list-inside list-disc pt-3 text-lg text-n300 marker:text-[10px] marker:text-n900">
                <li>
                  You must be at least 18 years old and legally capable of
                  entering into contracts to use our services. By using our
                  services, you represent that you meet these criteria.
                </li>
                <li className="pt-3">
                  You must be at least 18 years old and legally capable of
                  entering into contracts to use our services. By using our
                  services, you represent that you meet these criteria.
                </li>
              </ul>
            </li>
            <li className="marker:heading-4">
              <span className="heading-4">Service Description</span>
              <ul className="block list-inside list-disc pt-3 text-lg text-n300 marker:text-[10px] marker:text-n900">
                <li>
                  Our website provides a platform for users to On Demand
                  Services. We do not provide the services ourselves but
                  facilitate connections between users and service providers.
                </li>
              </ul>
            </li>
            <li className="marker:heading-4">
              <span className="heading-4">Payment Terms</span>
              <ul className="block list-inside list-disc pt-3 text-lg text-n300 marker:text-[10px] marker:text-n900">
                <li>
                  Payment for services must be made through our platform. We may
                  use third-party payment processors, and you agree to abide by
                  their terms and conditions.
                </li>
                <li className="pt-3">
                  Fees for services are determined by service providers and may
                  vary. We are not responsible for disputes over payment or
                  service quality.
                </li>
              </ul>
            </li>
            <li className="marker:heading-4">
              <span className="heading-4">User Responsibilities</span>
              <ul className="block list-inside list-disc pt-3 text-lg text-n300 marker:text-[10px] marker:text-n900">
                <li>
                  Users are responsible for their interactions with service
                  providers. We do not endorse or guarantee the quality of
                  services provided by service providers.
                </li>
                <li className="pt-3">
                  Users agree to treat service providers with respect and to use
                  our platform for lawful purposes only.
                </li>
                <li className="pt-3">
                  Our website and services, including content, logos, and
                  trademarks, are protected by intellectual property laws. Users
                  may not use our intellectual property without permission.
                </li>
              </ul>
            </li>

            <li className="marker:heading-4">
              <span className="heading-4">Privacy Policy</span>
              <ul className="block list-inside list-disc pt-3 text-lg text-n300 marker:text-[10px] marker:text-n900">
                <li>
                  Our privacy policy governs how we collect, use, and disclose
                  personal information. By using our services, you agree to our
                  privacy policy.
                </li>
              </ul>
            </li>
            <li className="marker:heading-4">
              <span className="heading-4">Limitation of Liability</span>
              <ul className="block list-inside list-disc pt-3 text-lg text-n300 marker:text-[10px] marker:text-n900">
                <li>
                  We are not liable for any direct, indirect, incidental,
                  special, or consequential damages resulting from your use of
                  our services.
                </li>
                <li className="pt-3">
                  We do not guarantee the availability, accuracy, or reliability
                  of our services and are not responsible for any harm or loss
                  resulting from your reliance on them.
                </li>
                <li className="pt-3">
                  You agree to indemnify and hold us harmless from any claims,
                  losses, damages, liabilities, and expenses arising from your
                  use of our services or violation of these terms and
                  conditions.
                </li>
                <li className="pt-3">
                  These terms and conditions are governed by the laws of [Your
                  Jurisdiction]. Any disputes arising under these terms and
                  conditions shall be resolved in the courts of Services
                </li>
              </ul>
            </li>
            <li className="marker:heading-4">
              <span className="heading-4">Changes to Terms</span>
              <ul className="block list-inside list-disc pt-3 text-lg text-n300 marker:text-[10px] marker:text-n900">
                <li>
                  We reserve the right to modify these terms and conditions at
                  any time. Changes will be effective upon posting on our
                  website. Continued use of our services constitutes acceptance
                  of the modified terms.
                </li>
              </ul>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}

export default page;
