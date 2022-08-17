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
  answerType: MissionTypes;
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
}

const SubmissionsView: ComponentType<ISubmissionsView> = ({
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
        <section>
          <h3 className="mb-4 text-xl font-bold">Photo Submissions</h3>
          <SubmissionsViewImageType
            {...{ currentPage, submissionsPaginated, isLoading, onDelete }}
          />
        </section>
      )}

      {answerType === MissionTypes.TEXT && (
        <section>
          <h3 className="mb-4 text-xl font-bold">Text Submissions</h3>
          <SubmissionsViewTextType
            {...{ currentPage, submissionsPaginated, isLoading, onDelete }}
          />
        </section>
      )}

      {answerType === MissionTypes.GPS && (
        <section>
          <h3 className="mb-4 text-xl font-bold">GPS Submissions</h3>
          <SubmissionsViewGpsType
            {...{ currentPage, submissionsPaginated, isLoading, onDelete }}
          />
        </section>
      )}
    </>
  );
};

export default SubmissionsView;
