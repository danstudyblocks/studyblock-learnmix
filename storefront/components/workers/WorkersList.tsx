"use client";

import { useState } from "react";
import { PiSliders } from "react-icons/pi";
import { topExperts } from "../../data/data";
import StaggerEffectTwo from "../animation/StaggerEffectTwo";
import ExpertCard from "../ui/ExpertCard";
import Pagination from "../ui/Pagination";
import WorkersFilterModal from "./WorkersFilterModal";

function WorkersList() {
  const [filterModal, setFilterModal] = useState(false);
  return (
    <section className="sbp-30 stp-30">
      <div className="container">
        <h2 className="heading-2 pb-3">
          Discover the world’s best flexible talent
        </h2>
        <p className="font-medium text-n300">
          Browse and connect with top talent who can help bring your next
          project to life
        </p>

        <div className="stp-15 sbp-15 flex items-start justify-start">
          <div className="flex flex-wrap items-center justify-start gap-3 overflow-hidden rounded-lg border border-b50 p-1 min-[380px]:rounded-full">
            <div
              onClick={() => setFilterModal(true)}
              className="flex cursor-pointer items-center justify-start gap-3 rounded-full bg-n30 px-5 py-3 text-start font-medium text-n300"
            >
              <PiSliders />
              <span className="">Filters</span>
            </div>
            <div className="flex cursor-pointer rounded-full bg-n30 px-5 py-3 text-start font-medium text-n300">
              <span className="">Location</span>
            </div>
            <div className="cursor-pointer rounded-full bg-n30 px-5 py-3 text-start font-medium text-n300">
              <span className="">Rate</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6 sbp-15">
          {topExperts.map(({ id, ...props }, idx) => (
            <div className="md:col-span-6 xl:col-span-4 col-span-12" key={id}>
              <StaggerEffectTwo id={idx}>
                <ExpertCard {...props} />
              </StaggerEffectTwo>
            </div>
          ))}
        </div>
        <Pagination />
      </div>

      <WorkersFilterModal
        filterModal={filterModal}
        setFilterModal={setFilterModal}
      />
    </section>
  );
}

export default WorkersList;
