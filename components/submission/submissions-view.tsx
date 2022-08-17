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
import SubmissionsViewGpsType from "./submissions-view-gps-type";
import SubmissionsViewImageType from "./submissions-view-image-type";
import SubmissionsViewTextType from "./submissions-view-text-type";

interface ISubmissionsView {
  mission: Mission;
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
}

const SubmissionsView: ComponentType<ISubmissionsView> = ({
  mission,
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
      {mission.answer_type === MissionTypes.IMAGE && (
        <SubmissionsViewImageType
          {...{ currentPage, submissionsPaginated, isLoading, onDelete }}
        />
      )}

      {mission.answer_type === MissionTypes.TEXT && (
        <SubmissionsViewTextType
          {...{ currentPage, submissionsPaginated, isLoading, onDelete }}
        />
      )}

      {mission.answer_type === MissionTypes.GPS && (
        <SubmissionsViewGpsType
          {...{ currentPage, submissionsPaginated, isLoading, onDelete }}
        />
      )}
    </>
  );
};

export default SubmissionsView;
