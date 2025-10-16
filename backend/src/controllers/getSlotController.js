import prisma from "../db/config.js";

const getSlotByRollNumber = async (req, res) => {
    const {roll_no} = req.params;
    try{
        const entry = await prisma.entry.findUnique({
            where: {
                roll_no: BigInt(roll_no),
            },
            include: {
                slot: true,
            }
        });
        if(!entry){
            return res.status(404).json({message: "Entry not found"});
        }
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];
        const formattedTime = now.toTimeString().split(" ")[0];
        return res.status(200).json({
          slotId: entry.slot.id,
          isEmpty: entry.slot.isEmpty,
          time: Date.now(),
          date: formattedDate,
          time: formattedTime,
        });
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({message: "An error occured while fetching the data"});
    }
};

export { getSlotByRollNumber };