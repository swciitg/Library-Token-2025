import axios from "axios";

export async function getSlotId(rollNo) {
    try {
        const { data } = await axios.post("http://localhost:5001/api/entry", { rollNo });
        return data;
    } catch (err) {
        console.error(err);
        if (err.response) {
            return { error: err.response.data.message || "Server Error!" };
        } else if (err.request) {
            return { error: "Network error!" };
        } else {
            return { error: err.message };
        }
    }
}