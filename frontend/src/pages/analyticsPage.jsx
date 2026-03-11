import { AdminHeader } from "../components/adminHeader";
import Analytics from "../components/analytics";
import {Footer} from "../components/Footer";

export default function AnalyticsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
        <AdminHeader />
        <div className="flex-grow flex items-center justify-center">
            <Analytics />
        </div>
        <Footer />
    </div>
  );
}
       