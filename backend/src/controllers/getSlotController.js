import prisma from "../db/config.js";
import { DatabaseError } from "../errors/DatabaseError.js";
import { WebSocketError } from "../errors/WebSocketError.js";

const getSlotByRollNumber = async (req, res, next) => {
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
            const ws = req.userConnections.get(roll_no.toString());
            if (ws && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    type: "slot_info",
                    data: {
                        message: "No slot assigned to this roll number"
                    }
                }));
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
            type: "slot_info",
            data: {
                slotId: entry.slot.id,
                isEmpty: entry.slot.isEmpty,
                time: Date.now(),
                date: formattedDate,
                timeString: formattedTime,
            }
        };

        const ws = req.userConnections.get(roll_no.toString());
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify(slotData));
        }
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
        const ws = req.userConnections.get(roll_no.toString());
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({
                type: 'slot_error',
                data: {
                    message: "An error occurred while fetching the data"
                }
            }));
        }
        return next(new DatabaseError("An error occurred while fetching the data"));
    }
};

const getAllSlot = async (req, res, next) => {
  try {
    const slots = await prisma.slot.findMany({
      where: {
        id: {
          lt: 585,
        },
      },
      include: {
        entry: false,
      },
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json(slots);
  } catch (error) {
    console.error(error);
    return next(new DatabaseError("An error occurred while fetching the slot data"));
  }
};

export { getSlotByRollNumber, getAllSlot };
