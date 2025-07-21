import { getSettings } from "@/actions/settings.actions";
import WhatsAppButton from "@/components/FloatingButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/providers/CartContext";
import Topbar from "@/components/Topbar";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const settings = await getSettings()
    return (
        <div>
            <CartProvider>
                <Topbar settings={settings} />
                <div className="min-h-screen">
                <Navbar />
                    {children}
                    </div>
                <WhatsAppButton />
                <Footer />
            </CartProvider>
        </div>
    );
}
