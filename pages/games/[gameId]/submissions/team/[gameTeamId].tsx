import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Pagination from "../../../../../components/common/pagination";
import SubmissionsViewByTeam from "../../../../../components/submission/by-team/submissions-view-by-team";
import PaginateResponseDto from "../../../../../libs/dtos/paginate-response-dto";
import { AnswerTypes } from "../../../../../libs/enums";
import GameTeam from "../../../../../libs/models/game-team";
import Submission from "../../../../../libs/models/submission";
import GameTeamService from "../../../../../libs/services/game-team-service";
import createServerSideService from "../../../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  {
    page: number;
    gameTeam: GameTeam;
    submissionsPaginationsGroupedByAnswerTypes: {
      [key: string]: PaginateResponseDto<Submission>;
    };
  },
  { gameId: string; gameTeamId: string }
> = async (context) => {
  const gameId = context.params?.gameId ?? "";
  const gameTeamId = context.params?.gameTeamId ?? "";
  const page = Number(context.query.page ?? 1);

  const gameTeamService = await createServerSideService(
    context.req,
    GameTeamService
  );

  const missionTypeValues = Object.values(AnswerTypes)
    .map(Number)
    .filter((x) => !isNaN(x));

  const submissionsPaginatedPromises = missionTypeValues.map((answerType) =>
    gameTeamService.getSubmissionsPaginatedByMissionAnswerType(
      gameId,
      gameTeamId,
      { page, answer_type: answerType }
    )
  );

  const [gameTeam, ...submissionsPaginations] = await Promise.all([
    gameTeamService.getOneById(gameId, gameTeamId),
    ...submissionsPaginatedPromises,
  ]);

  const submissionsPaginationsGroupedByAnswerTypes = Object.fromEntries(
    missionTypeValues.map((typeValue, idx) => [
      AnswerTypes[typeValue],
      submissionsPaginations[idx],
    ])
  );

  return {
    props: {
      page,
      gameTeam,
      submissionsPaginationsGroupedByAnswerTypes,
    },
  };
};

const SubmissionsByGameTeamPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ page, gameTeam, submissionsPaginationsGroupedByAnswerTypes }) => {
  return (
    <>
      {Object.entries(submissionsPaginationsGroupedByAnswerTypes).map(
        ([type, pagination]) => {
          const key = `${type}|${pagination.current_page}`;

          const answerType = Object.entries(AnswerTypes)
            .filter(([k, _]) => k === type)
            .map(([_, v]) => v)
            .at(0) as AnswerTypes;

          return (
            <section key={key} className="my-4">
              <h3 className="mb-4 text-2xl font-bold">
                <span className="capitalize">{type.toLowerCase()}</span>{" "}
                <span>Submissions</span>
              </h3>

              <SubmissionsViewByTeam
                answerType={answerType}
                currentPage={pagination.current_page}
                submissionsPaginated={pagination}
              />

              <div className="divider" />
            </section>
          );
        }
      )}
    </>
  );
};

export default SubmissionsByGameTeamPage;
