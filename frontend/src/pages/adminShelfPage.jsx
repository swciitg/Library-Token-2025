import AdminShelf from "../components/adminShelf";
import {Footer} from "../components/Footer";
import { Header } from "../components/Header";
export default function AdminShelfPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
            <AdminShelf />
        </div>
        <Footer />
    </div>
  );
}
       