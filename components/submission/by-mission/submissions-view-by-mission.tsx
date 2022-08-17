import { useRouter } from "next/router";
import { ComponentType } from "react";
import toast from "react-hot-toast";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import { AnswerTypes } from "../../../libs/enums";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Submission from "../../../libs/models/submission";
import SubmissionService from "../../../libs/services/submission-service";
import SubmissionsViewByMissionGpsType from "./submissions-view-by-mission-gps-type";
import SubmissionsViewByMissionImageType from "./submissions-view-by-mission-image-type";
import SubmissionsViewByMissionTextType from "./submissions-view-by-mission-text-type";

interface ISubmissionsViewByMission {
  answerType: AnswerTypes;
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
}

const SubmissionsViewByMission: ComponentType<ISubmissionsViewByMission> = ({
  answerType,
  currentPage,
  submissionsPaginated,
}) => {
  const router = useRouter();
  const submissionService = useService(SubmissionService);

  const onDelete = async (submission: Submission) => {
    await toast.promise(submissionService.delete(submission), {
      loading: "Deleting submission...",
      success: "Submission deleted!",
      error: "Failed to delete submission",
    });

    router.push(router.asPath);
  };

  return (
    <>
      {answerType === AnswerTypes.IMAGE && (
        <SubmissionsViewByMissionImageType
          {...{ currentPage, submissionsPaginated, onDelete }}
        />
      )}

      {answerType === AnswerTypes.TEXT && (
        <SubmissionsViewByMissionTextType
          {...{ currentPage, submissionsPaginated, onDelete }}
        />
      )}

      {answerType === AnswerTypes.GPS && (
        <SubmissionsViewByMissionGpsType
          {...{ currentPage, submissionsPaginated, onDelete }}
        />
      )}
    </>
  );
};

export default SubmissionsViewByMission;
