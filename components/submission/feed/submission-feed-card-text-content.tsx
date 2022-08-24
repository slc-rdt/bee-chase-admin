import React, { ComponentProps, ComponentType } from "react";
import Submission from "../../../libs/models/submission";
import SubmissionAnswerData from "../../../libs/models/submission-answer-data";

interface ISubmissionFeedCardTextContent {
  answerData: SubmissionAnswerData;
}

const SubmissionFeedCardTextContent: ComponentType<
  ComponentProps<"div"> & ISubmissionFeedCardTextContent
> = ({ answerData, ...rest }) => {
  return (
    <div
      {...rest}
      className="grid h-32 place-items-center rounded-xl bg-base-300 text-xl italic"
    >
      &quot;{answerData.text}&quot;
    </div>
  );
};

export default SubmissionFeedCardTextContent;
