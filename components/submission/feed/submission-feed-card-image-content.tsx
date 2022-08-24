import axios, { AxiosError } from "axios";
import React, {
  ComponentProps,
  ComponentType,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import Submission from "../../../libs/models/submission";
import SubmissionAnswerData from "../../../libs/models/submission-answer-data";

interface ISubmissionFeedCardImageContent {
  submission: Submission;
  answerData: SubmissionAnswerData;
}

interface OneDriveTokenApiDto {
  token?: string;
  error?: string;
}

const SubmissionFeedCardImageContent: ComponentType<
  ComponentProps<"div"> & ISubmissionFeedCardImageContent
> = ({ submission, answerData, ...rest }) => {
  const { data, error } = useSWR<string>(
    answerData.download_url,
    async (url) => {
      try {
        const { data } = await axios
          .get<OneDriveTokenApiDto>("/api/one-drive/token")
          .then((resp) =>
            axios.get(url, {
              headers: {
                Authorization: `Bearer ${resp.data.token}`,
              },
            })
          );
        return data["@microsoft.graph.downloadUrl"];
      } catch (error) {
        const err = error as AxiosError<OneDriveTokenApiDto>;
        toast.error(err.response?.data.error ?? err.message);
        console.error(error);
      }
    }
  );

  return (
    <div {...rest}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {data && <img src={data} className="rounded-xl" alt="submission image" />}
    </div>
  );
};

export default SubmissionFeedCardImageContent;
