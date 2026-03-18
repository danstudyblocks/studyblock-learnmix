import { Label, clx } from "@medusajs/ui"

type FilterDropdownProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: string
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterDropdown = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterDropdownProps) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(event.target.value)
  }

  return (
    <div className="flex flex-col gap-y-3">
      <h5 className="heading-5">{title}</h5>
      <div className="relative">
        <Label htmlFor="filter-dropdown" className="sr-only">
          {title}
        </Label>
        <select
          id="filter-dropdown"
          value={value}
          onChange={handleSelectChange}
          data-testid={dataTestId}
          className={clx(
            "block w-full px-3 py-2 text-base leading-6 border rounded-md shadow-sm focus:outline-none",
            "border-gray-300 bg-white text-ui-fg-base"
          )}
        >
          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterDropdown
