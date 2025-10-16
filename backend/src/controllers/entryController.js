import prisma from "../db/config.js";
import findFirstEmptySlot from "../utils/findEmpty.js";

export const addDeleteEntry = (async(req, res)=>{
    const data = req.body;
    console.log(data);

    const rollNo = parseInt(data.rollNo, 10);
    console.log(rollNo);

    try{
        const existing = await prisma.entry.findUnique({where:{roll_no:rollNo}});
        if(existing){
            await prisma.entry.delete({where:{roll_no:rollNo}});
            await prisma.slot.update({
                where:{slot_id:existing.allocated_slot},
                data:{is_empty:true}
            });
            return res.status(200).json({message:"checkout successfull", checkout_slot:existing.allocated_slot});
        }else{
            const slot = await findFirstEmptySlot();
            if(!slot){
                return res.status(400).json({messagr:"no empty slot is available"});
            }
            const newEntry = await prisma.entry.create({
                data:{roll_no:rollNo, allocated_slot:slot.slot_id},
            })
            await prisma.slot.update({
                where:{slot_id:slot.slot_id},
                data:{is_empty:false}
            });
            // return res.send(entry);
            console.log(newEntry);
            console.log(slot.slot_id);
            return res.status(200).json({message:"Check-in successful",checkin_slot: slot.slot_id });
        }
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }

})