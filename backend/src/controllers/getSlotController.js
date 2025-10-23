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


        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];
        const formattedTime = now.toTimeString().split(" ")[0]; 


        if(!entry){
            if(req.isUserConnected(roll_no)){
                req.emitToUser(roll_no, "no_slot_assigned", {
                    message: "No slot assigned to this roll number",
                });
            }
            return res.status(200).json({
          slotId: null,
          isEmpty: true,
          time: Date.now(),
          date: formattedDate,
          time: formattedTime,
        });

        }
        

        const slotData = {
            slotId: entry.slot.id,
            isEmpty: entry.slot.isEmpty,
            time: Date.now(),
            date: formattedDate,
            time: formattedTime,
        }

        req.emitToUser(roll_no, "slot_info", slotData);
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
        if (req.isUserConnected(roll_no)) {
            req.emitToUser(roll_no, 'slot_error', {
                message: "An error occurred while fetching the data"
            });
        }
        return res.status(500).json({message: "An error occured while fetching the data"});
    }
};

const getAllSlot = async (req, res) => {
  try {
    const slots = await prisma.slot.findMany({
      include: {
        entry: false,
      },
    });
    const emptySlotIds = slots
      .filter((slot) => slot.isEmpty)
      .map((slot) => slot.id);
    return res.status(200).json(emptySlotIds);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occured while feeding the slot data",
    });
  }
};

export { getSlotByRollNumber, getAllSlot };
