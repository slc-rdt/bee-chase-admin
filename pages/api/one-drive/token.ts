import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  token?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { data } = await axios.get<{ token: string }>(
      `${process.env.BLUEJACK_API_URL}/Account/GetOneDriveToken`
    );
    res.status(200).json(data);
  } catch (error) {
    const err = error as Error;
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
