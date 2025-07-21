import Hero from "@/components/sections/Hero";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import WhyUs from "@/components/sections/WhyUs";
import Blog from "@/components/sections/Blog";
import RasAI from "@/components/sections/RasAI";
import AvailableInStores from "@/components/sections/AvailableInStores";
import ProductBenefits from "@/components/sections/ProductBenefits";
import Testimonials from "@/components/sections/Testimonials";
export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <Hero />
                <WhyUs />
                <FeaturedProducts />
                <RasAI />
                <AvailableInStores />
                {/* <ProductBenefits /> */}
                <Testimonials />
                <Blog />
            </main>
        </div>
    );
}
