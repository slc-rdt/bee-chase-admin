import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import SubmissionsViewByMission from "../../../../../components/submission/by-mission/submissions-view-by-mission";
import PaginateResponseDto from "../../../../../libs/dtos/paginate-response-dto";
import Mission from "../../../../../libs/models/mission";
import Submission from "../../../../../libs/models/submission";
import MissionService from "../../../../../libs/services/mission-service";
import SubmissionService from "../../../../../libs/services/submission-service";
import createServerSideService from "../../../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  {
    page: number;
    mission: Mission;
    submissionsPaginated: PaginateResponseDto<Submission>;
  },
  { gameId: string; missionId: string }
> = async (context) => {
  const gameId = context.params?.gameId ?? "";
  const missionId = context.params?.missionId ?? "";
  const page = Number(context.query.page ?? 1);

  const [missionService, submissionService] = await Promise.all([
    createServerSideService(context.req, MissionService),
    createServerSideService(context.req, SubmissionService),
  ]);

  const [mission, submissionsPaginated] = await Promise.all([
    missionService.getOneById(gameId, missionId),
    submissionService.getAllPaginatedByMission(gameId, missionId, page),
  ]);

  return {
    props: {
      gameId,
      page,
      mission,
      submissionsPaginated,
    },
  };
};

const SubmissionsByMissionPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ page, mission, submissionsPaginated }) => {
  return (
    <>
      <header className="mb-4 text-center">
        <h2 className="mb-2 text-3xl font-bold">{mission?.name}</h2>
        <p>
          {submissionsPaginated.total} submissions | {mission?.point_value}{" "}
          points
        </p>
      </header>

      <SubmissionsViewByMission
        answerType={mission.answer_type}
        currentPage={page}
        submissionsPaginated={submissionsPaginated}
      />
    </>
  );
};

export default SubmissionsByMissionPage;
