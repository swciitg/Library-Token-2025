import axios from "axios";

export async function allotSlot(rollNo) {
  try {
    const { data } = await axios.post("http://localhost:5001/library/allot", {
      rollNo,
    });
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

export async function changeDb(rollNo, slotId, status) {
  try {
    const { data } = await axios.post("http://localhost:5001/library/change", {
      rollNo,
      slotId,
      status,
    });
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
