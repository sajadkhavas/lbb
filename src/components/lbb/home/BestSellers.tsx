import { Link } from "@tanstack/react-router";
import { bestSellers } from "@/lib/products";
import { ProductCard } from "@/components/lbb/ProductCard";
import { Band, SectionHead } from "@/components/lbb/ui/primitives";
import { useReveal } from "@/hooks/use-reveal";

const bestsellers = bestSellers(4);

export function BestSellers() {
  const ref = useReveal<HTMLElement>({ selector: ".bs-card", y: 40 });

  return (
    <Band label="پرفروش‌ترین‌ها">
      <div ref={ref}>
        <SectionHead
          index="07"
          label="BESTSELLERS"
          title="پرفروش‌ترین‌ها"
          action={
            <Link to="/shop" className="tech text-bone transition-colors hover:text-signal">
              مشاهده همه →
            </Link>
          }
          className="px-5 md:px-10"
        />
        <div className="mt-8 grid grid-cols-2 gap-4 px-5 lg:grid-cols-4 lg:grid-rows-2 md:px-10">
          {bestsellers.map((p, i) => (
            <div key={p.id} className={`bs-card ${i === 0 ? "col-span-2 lg:col-span-2 lg:row-span-2" : ""}`}>
              <ProductCard p={p} priority={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </Band>
  );
}
