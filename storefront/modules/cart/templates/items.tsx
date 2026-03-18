import repeat from "@lib/util/repeat";
import { HttpTypes } from "@medusajs/types";
import Item from "@modules/cart/components/item";
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item";

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[];
};

const ItemsTemplate = ({ items }: ItemsTemplateProps) => {
  return (
    <div className="mt-5">
      <div className="pb-3 flex items-center">
        <h2 className="text-2xl font-bold">Cart</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-600">
              <th className="px-4 py-3 pl-6 font-medium">Item</th>
              <th className="py-3"></th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="hidden small:table-cell px-4 py-3 font-medium">
                Price
              </th>
              <th className="py-3 pr-6 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "")
                      ? -1
                      : 1;
                  })
                  .map((item) => <Item key={item.id} item={item} />)
              : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemsTemplate;
