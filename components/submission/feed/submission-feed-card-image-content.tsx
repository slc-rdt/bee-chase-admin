import { ComponentProps, ComponentType } from "react";
import useOneDriveFile from "../../../libs/hooks/common/use-one-drive-file";
import Submission from "../../../libs/models/submission";
import SubmissionAnswerData from "../../../libs/models/submission-answer-data";

interface ISubmissionFeedCardImageContent {
  submission: Submission;
  answerData: SubmissionAnswerData;
}

const SubmissionFeedCardImageContent: ComponentType<
  ComponentProps<"div"> & ISubmissionFeedCardImageContent
> = ({ submission, answerData, ...rest }) => {
  const { data } = useOneDriveFile(answerData.download_url);
  return (
    <div {...rest}>
      {data && (
        <>
          {answerData.mime_type?.includes("video") ? (
            <video src={data} controls></video>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data} className="rounded-xl" alt="submission image" />
            </>
          )}
        </>
      )}
      {!data && (
        <div className="btn loading btn-ghost h-96 w-full animate-pulse rounded-xl bg-base-300" />
      )}
    </div>
  );
};

export default SubmissionFeedCardImageContent;
