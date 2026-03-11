import Analytics from "../components/analytics";
import {Footer} from "../components/Footer";
import { Header } from "../components/Header";

export default function AnalyticsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
            <Analytics />
        </div>
        <Footer />
    </div>
  );
}
       