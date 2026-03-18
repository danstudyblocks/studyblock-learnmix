import Link from "next/link";
import { PiCaretDoubleRight } from "react-icons/pi";

type PropsType = {
  pageName: string;
  isMiddlePage?: boolean;
  middlePageName?: string;
  middlePageLink?: string;
};

function BreadCrumb2({
  pageName,
  isMiddlePage,
  middlePageName,
  middlePageLink,
}: PropsType) {
  return (
    <section className="stp-30 4xl:large-container mx-4 mt-[100px] rounded-3xl bg-n900 pb-52 md:pb-60 lg:rounded-[60px] lg:pb-72">
      <div className="container flex flex-col items-center justify-center gap-3 text-white">
        <h2 className="heading-2">{pageName}</h2>

        <ul className="flex items-center justify-start gap-2 pt-3 font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>
          {isMiddlePage && (
            <>
              <li className="">
                <PiCaretDoubleRight />
              </li>
              <li>
                <Link href={middlePageLink!}>{middlePageName}</Link>
              </li>
            </>
          )}
          <li className="text-r300">
            <PiCaretDoubleRight />
          </li>
          <li className="text-r300">{pageName}</li>
        </ul>
      </div>
    </section>
  );
}

export default BreadCrumb2;
