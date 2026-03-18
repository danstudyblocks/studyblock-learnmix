import Link from "next/link";
import { PiCaretDoubleRight } from "react-icons/pi";

function BreadCrumb() {
  return (
    <section className="stp-15 sbp-15 mt-[100px] bg-n20">
      <div className="container flex flex-col items-center justify-center">
        <h2 className="heading-2">About Us</h2>
        <ul className="flex items-center justify-center gap-2 pt-3 font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li className="text-r300">
            <PiCaretDoubleRight />
          </li>
          <li className="text-r300">About Us</li>
        </ul>
      </div>
    </section>
  );
}

export default BreadCrumb;
