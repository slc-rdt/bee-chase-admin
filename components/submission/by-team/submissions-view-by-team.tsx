import { useRouter } from "next/router";
import { ComponentType } from "react";
import toast from "react-hot-toast";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import { AnswerTypes } from "../../../libs/enums";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Submission from "../../../libs/models/submission";
import SubmissionService from "../../../libs/services/submission-service";
import SubmissionsViewByMissionMultipleChoiceType from "./submissions-view-by-mission-multiple-choice-type";
import SubmissionsViewByTeamGpsType from "./submissions-view-by-team-gps-type";
import SubmissionsViewByTeamImageType from "./submissions-view-by-team-image-type";
import SubmissionsViewByTeamTextType from "./submissions-view-by-team-text-type";

interface ISubmissionsViewByTeam {
  answerType: AnswerTypes;
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
}

const SubmissionsViewByTeam: ComponentType<ISubmissionsViewByTeam> = ({
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
        <SubmissionsViewByTeamImageType
          {...{ currentPage, submissionsPaginated, onDelete }}
        />
      )}

      {answerType === AnswerTypes.TEXT && (
        <SubmissionsViewByTeamTextType
          {...{ currentPage, submissionsPaginated, onDelete }}
        />
      )}

      {answerType === AnswerTypes.GPS && (
        <SubmissionsViewByTeamGpsType
          {...{ currentPage, submissionsPaginated, onDelete }}
        />
      )}

      {answerType === AnswerTypes.MULTIPLE_CHOICE && (
        <SubmissionsViewByMissionMultipleChoiceType
          {...{ currentPage, submissionsPaginated, onDelete }}
        />
      )}
    </>
  );
};

export default SubmissionsViewByTeam;
