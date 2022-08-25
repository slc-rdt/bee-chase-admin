import { ComponentProps, ComponentType } from "react";
import useOneDriveImage from "../../../libs/hooks/common/use-one-drive-image";
import Submission from "../../../libs/models/submission";
import SubmissionAnswerData from "../../../libs/models/submission-answer-data";

interface ISubmissionFeedCardImageContent {
  submission: Submission;
  answerData: SubmissionAnswerData;
}

const SubmissionFeedCardImageContent: ComponentType<
  ComponentProps<"div"> & ISubmissionFeedCardImageContent
> = ({ submission, answerData, ...rest }) => {
  const { data } = useOneDriveImage(answerData.download_url);
  return (
    <div {...rest}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {data && <img src={data} className="rounded-xl" alt="submission image" />}
      {!data && (
        <div className="btn loading btn-ghost h-96 w-full animate-pulse rounded-xl bg-base-300" />
      )}
    </div>
  );
};

export default SubmissionFeedCardImageContent;
