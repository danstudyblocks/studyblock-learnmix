const Radio = ({
  checked,
  'data-testid': dataTestId,
}: {
  checked: boolean;
  'data-testid'?: string;
}) => {
  return (
    <>
      <button
        type="button"
        role="radio"
        aria-checked={checked ? "true" : "false"}
        data-state={checked ? "checked" : "unchecked"}
        className="relative flex h-5 w-5 items-center justify-center outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        data-testid={dataTestId || "radio-button"}
      >
        <div
          className={`flex h-[14px] w-[14px] items-center justify-center rounded-full border transition-all ${
            checked
              ? "bg-indigo-500 border-indigo-500"
              : "bg-white border-gray-300"
          }`}
        >
          {checked && (
            <span className="flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
            </span>
          )}
        </div>
      </button>
    </>
  );
};

export default Radio;
