import RollEntry from "../components/RollNoEntry";
import {Header}  from "../components/Header";
import {Footer} from "../components/Footer";
export default function InputPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center border-b border-gray-400">
            <RollEntry />
        </div>
        <Footer />
    </div>
  );
}
