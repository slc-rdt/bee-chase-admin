import { ComponentType } from "react";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import { MissionTypes } from "../../libs/enums";
import Mission from "../../libs/models/mission";
import Submission from "../../libs/models/submission";
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
  return (
    <>
      {mission.answer_type === MissionTypes.IMAGE && (
        <SubmissionsViewImageType {...{ currentPage, submissionsPaginated }} />
      )}

      {mission.answer_type === MissionTypes.TEXT && (
        <SubmissionsViewTextType {...{ currentPage, submissionsPaginated }} />
      )}

      {mission.answer_type === MissionTypes.GPS && (
        <SubmissionsViewGpsType {...{ currentPage, submissionsPaginated }} />
      )}
    </>
  );
};

export default SubmissionsView;
