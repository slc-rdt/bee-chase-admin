import dynamic from "next/dynamic";
import React, { ComponentProps, ComponentType } from "react";
import Submission from "../../../libs/models/submission";
import SubmissionAnswerData from "../../../libs/models/submission-answer-data";

const LeafletMap = dynamic(() => import("../../common/laeflet-map"), {
  ssr: false,
});

interface ISubmissionFeedCardGpsContent {
  answerData: SubmissionAnswerData;
}

const SubmissionFeedCardGpsContent: ComponentType<
  ComponentProps<"div"> & ISubmissionFeedCardGpsContent
> = ({ answerData, ...rest }) => {
  return (
    <div {...rest}>
      <LeafletMap
        latitude={answerData.latitude ?? 0}
        longitude={answerData.longitude ?? 0}
      />
    </div>
  );
};

export default SubmissionFeedCardGpsContent;
