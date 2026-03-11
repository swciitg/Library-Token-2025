import { AdminHeader } from "../components/adminHeader";
import AdminShelf from "../components/adminShelf";
import {Footer} from "../components/Footer";
export default function AdminShelfPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
        <AdminHeader />
        <div className="flex-grow flex items-center justify-center">
            <AdminShelf />
        </div>
        <Footer />
    </div>
  );
}
       