import { PiCurrencyDollarSimpleBold } from "react-icons/pi";

function StepFour() {
  return (
    <div>
      <h4 className="heading-4">Suggest your budget</h4>

      <p className="pt-10 font-medium text-n300">What is your budget?*</p>
      <p className="pt-1 text-n300">
        You can always negotiate the final price.*
      </p>

      <div className="mt-4 flex items-center justify-start gap-3 rounded-2xl bg-n30 p-3">
        <PiCurrencyDollarSimpleBold />
        <input
          type="text"
          className="w-full bg-transparent outline-none placeholder:font-medium placeholder:text-n900"
          placeholder="Enter budget"
        />
      </div>
    </div>
  );
}

export default StepFour;
