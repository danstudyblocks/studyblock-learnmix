import ireland from "@/public/images/country_Ireland.png";
import arzentina from "@/public/images/country_argentina.png";
import australia from "@/public/images/country_australia.png";
import brazil from "@/public/images/country_brazil.png";
import singapoore from "@/public/images/country_singapore.png";
import Image from "next/image";
import { SetStateAction } from "react";
import { PiCaretRightBold } from "react-icons/pi";

const countryList = [
  {
    id: 101,
    name: "Australia",
    img: australia,
  },
  {
    id: 102,
    name: "Brazil",
    img: brazil,
  },
  {
    id: 103,
    name: "Ireland",
    img: ireland,
  },
  {
    id: 104,
    name: "Arzentina",
    img: arzentina,
  },
  {
    id: 105,
    name: "Singapore",
    img: singapoore,
  },
];

function StepFive({
  steps,
  setSteps,
}: {
  steps: number;
  setSteps: React.Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="container grid grid-cols-12 pt-20">
      <div className="col-span-12 sm:col-span-6 sm:col-start-4 lg:col-span-4 lg:col-start-5">
        <h4 className="heading-4">Select your region</h4>
        <ul className="flex flex-col gap-10 pt-10">
          {countryList.map(({ id, name, img }) => (
            <li
              key={id}
              className="flex items-center justify-between  cursor-pointer"
              onClick={() => setSteps(steps + 1)}
            >
              <div className="flex items-center justify-start gap-6">
                <Image src={img} alt="" />
                <p className="text-lg font-medium">{name}</p>
              </div>
              <div className="text-xl">
                <PiCaretRightBold />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StepFive;
