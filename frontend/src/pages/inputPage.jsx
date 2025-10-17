import RollEntry from "../components/RollNoEntry";
import Shelfs from "../components/shelf";


export default function inputPage(){
    return (
        <div>
            <h1 className="hover:text-gray-300 transition-all duration-150">Slot Allocation</h1>

            <RollEntry />
            {/* <Shelfs showSlot={showSlot} status={status}/> */}
        </div>
    )
}