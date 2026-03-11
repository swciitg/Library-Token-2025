import Analytics from "../components/analytics";
import {AdminHeader} from "../components/adminHeader";
import {Footer} from "../components/Footer";
import AdminNavbar from "../components/adminNav";

export default function AnalyticsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
        <AdminHeader />
        <AdminNavbar />
        <div className="flex-grow flex items-center justify-center">
            <Analytics />
        </div>
        <Footer />
    </div>
  );
}
       