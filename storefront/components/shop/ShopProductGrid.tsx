"use client";

import StaggerEffectTwo from "@/components/animation/StaggerEffectTwo";
import Card from "@/components/ui/Card";

export type ShopProductGridItem = {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  subtitle: string;
  handle: string;
  images: { url: string; width?: number; height?: number }[];
  region: { id: string };
  cheapestPrice: unknown;
};

function ShopProductGrid({ items }: { items: ShopProductGridItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 !text-xs">
      {items.map((p, idx) => (
        <div key={p.id}>
          <StaggerEffectTwo id={idx}>
            <Card p={p} />
          </StaggerEffectTwo>
        </div>
      ))}
    </div>
  );
}

export default ShopProductGrid;
