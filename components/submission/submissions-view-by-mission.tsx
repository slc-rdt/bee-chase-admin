import { useRouter } from "next/router";
import { ComponentType } from "react";
import toast from "react-hot-toast";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import { MissionTypes } from "../../libs/enums";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Mission from "../../libs/models/mission";
import Submission from "../../libs/models/submission";
import SubmissionService from "../../libs/services/submission-service";
import SubmissionsViewByMissionGpsType from "./submissions-view-by-mission-gps-type";
import SubmissionsViewByMissionImageType from "./submissions-view-by-mission-image-type";
import SubmissionsViewByMissionTextType from "./submissions-view-by-mission-text-type";

interface ISubmissionsViewByMission {
  answerType: MissionTypes;
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
  const { isLoading, doAction } = useLoading();

  const onDelete = async (submission: Submission) => {
    await toast.promise(doAction(submissionService.delete(submission)), {
      loading: "Deleting submission...",
      success: "Submission deleted!",
      error: "Failed to delete submission",
    });

    router.push(router.asPath);
  };

  return (
    <>
      {answerType === MissionTypes.IMAGE && (
        <SubmissionsViewByMissionImageType
          {...{ currentPage, submissionsPaginated, isLoading, onDelete }}
        />
      )}

      {answerType === MissionTypes.TEXT && (
        <SubmissionsViewByMissionTextType
          {...{ currentPage, submissionsPaginated, isLoading, onDelete }}
        />
      )}

      {answerType === MissionTypes.GPS && (
        <SubmissionsViewByMissionGpsType
          {...{ currentPage, submissionsPaginated, isLoading, onDelete }}
        />
      )}
    </>
  );
};

export default SubmissionsViewByMission;
