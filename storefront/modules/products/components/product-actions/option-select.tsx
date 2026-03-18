import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = option.values?.map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="pt-6 text-sm font-medium text-r300 text-start">Select {title}</span>
      <div
        className="flex flex-wrap gap-1 pt-3 text-sm text-n400"
        data-testid={dataTestId}
      >
{filteredOptions?.map((v) => (
          <button
            onClick={() => updateOption(option.title ?? "", v ?? "")}
            key={v}
            className={clx(
              "flex items-center justify-center gap-2 rounded-lg px-4 py-2 border transition-all duration-150",
              {
                "bg-red-100 text-red-600 border-red-400": v === current,
                "bg-white text-gray-700 border-gray-300 hover:shadow-md hover:border-gray-400":
                  v !== current,
              }
            )}
            disabled={disabled}
            data-testid="option-button"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

export default OptionSelect
