import AdminLogin from "../components/adminLogin";
import {AdminHeader} from "../components/adminHeader";
import {Footer} from "../components/Footer";


export default function AdminLoginPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
        <AdminHeader />
        <div className="flex-grow flex items-center justify-center">
            <AdminLogin />
        </div>
        <Footer />
    </div>
  );
}
       