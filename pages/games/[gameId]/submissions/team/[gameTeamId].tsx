import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import SubmissionsViewByTeam from "../../../../../components/submission/by-team/submissions-view-by-team";
import PaginateResponseDto from "../../../../../libs/dtos/paginate-response-dto";
import { AnswerTypes } from "../../../../../libs/enums";
import GameTeam from "../../../../../libs/models/game-team";
import Submission from "../../../../../libs/models/submission";
import GameTeamService from "../../../../../libs/services/game-team-service";
import createServerSideService from "../../../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  {
    gameTeam: GameTeam;
    submissionsPaginationsGroupedByAnswerTypes: {
      [key: string]: PaginateResponseDto<Submission>;
    };
  },
  { gameId: string; gameTeamId: string }
> = async (context) => {
  const gameId = context.params?.gameId ?? "";
  const gameTeamId = context.params?.gameTeamId ?? "";

  const gameTeamService = await createServerSideService(
    context.req,
    GameTeamService
  );

  const missionTypeValues = Object.values(AnswerTypes)
    .map(Number)
    .filter((x) => !isNaN(x));

  const submissionsPaginatedPromises = missionTypeValues.map((typeValue) => {
    const answerType = AnswerTypes[typeValue];
    const queryKey = `pageFor${answerType}`;
    const page = Number(context.query[queryKey] ?? 1);

    return gameTeamService.getSubmissionsPaginatedByMissionAnswerType(
      gameId,
      gameTeamId,
      { page, answer_type: typeValue }
    );
  });

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
      gameTeam,
      submissionsPaginationsGroupedByAnswerTypes,
    },
  };
};

const SubmissionsByGameTeamPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameTeam, submissionsPaginationsGroupedByAnswerTypes }) => {
  const totalSubmissions = Object.values(
    submissionsPaginationsGroupedByAnswerTypes
  )
    .map((x) => x.total)
    .reduce((a, b) => a + b);

  return (
    <>
      <header className="text-center">
        <h2 className="mb-4 text-3xl font-bold">{gameTeam.name}</h2>
        <p>{totalSubmissions} submissions</p>
      </header>

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
