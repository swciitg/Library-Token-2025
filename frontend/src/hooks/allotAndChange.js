import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosConfig = {
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

function handleAxiosError(err) {
  if (err.response) {
    return { error: err.response.data?.message || "Server Error!" };
  } else if (err.request) {
    return { error: "Network error!" };
  } else {
    return { error: err.message || "Unknown error" };
  }
} 

export async function allotSlot(rollNo) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/entry`,
      { token: rollNo },
      axiosConfig
    );
    return data;
  } catch (err) {
    return handleAxiosError(err);
  }
}

export async function changeDb(rollNo, slotId) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/change`,
      { rollNo, slotId },
      axiosConfig
    );
    return data;
  } catch (err) {
    return handleAxiosError(err);
  }
}

export async function allSlot() {
  try {
    const { data } = await axios.get(`${BASE_URL}/all-slot`, axiosConfig);
    return data;
  } catch (err) {
    return handleAxiosError(err);
  }
}