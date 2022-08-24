import axios, { AxiosError } from "axios";
import React, {
  ComponentProps,
  ComponentType,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import useOneDriveImage from "../../../libs/hooks/common/use-one-drive-image";
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
  const { data } = useOneDriveImage(answerData.download_url);
  return (
    <div {...rest}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {data && <img src={data} className="rounded-xl" alt="submission image" />}
    </div>
  );
};

export default SubmissionFeedCardImageContent;
