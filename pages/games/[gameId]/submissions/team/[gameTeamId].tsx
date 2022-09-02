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
import User from "../../../../../libs/models/user";
import GameService from "../../../../../libs/services/game-service";
import GameTeamService from "../../../../../libs/services/game-team-service";
import createServerSideService from "../../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../../libs/utils/handle-server-side-error";
import normalizeConstantCase from "../../../../../libs/utils/normalize-constant-case";

export const getServerSideProps: GetServerSideProps<
  {
    gameTeam?: GameTeam;
    members: User[];
    submissionsPaginationsGroupedByAnswerTypes: {
      [key: string]: PaginateResponseDto<Submission>;
    };
  },
  { gameId: string; gameTeamId: string }
> = async (context) => {
  try {
    const gameId = context.params?.gameId ?? "";
    const gameTeamId = context.params?.gameTeamId ?? "";

    const [gameService, gameTeamService] = await Promise.all([
      createServerSideService(context.req, GameService),
      createServerSideService(context.req, GameTeamService),
    ]);

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

    const [gameTeam, members, ...submissionsPaginations] = await Promise.all([
      gameService
        .getLeaderboard(gameId)
        .then((leaderboard) =>
          leaderboard.find((gameTeam) => gameTeam.id === gameTeamId)
        ),

      gameTeamService
        .getOneById(gameId, gameTeamId)
        .then((team) => team.members?.map((member) => member.user)),

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
        members,
        submissionsPaginationsGroupedByAnswerTypes,
      },
    };
  } catch (error) {
    return handleServerSideError(error, {
      destination: `/games`,
      permanent: false,
    });
  }
};

const SubmissionsByGameTeamPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameTeam, members, submissionsPaginationsGroupedByAnswerTypes }) => {
  return (
    <>
      <header className="text-center">
        <h2 className="mb-4 text-3xl font-bold">{gameTeam?.name}</h2>
        <p>
          {gameTeam?.submissions_count} submissions |{" "}
          {gameTeam?.missions_sum_point_value} points
        </p>
      </header>

      <section className="my-4">
        <h3 className="mb-4 text-2xl font-bold">Members</h3>
        <ol className="list-inside list-decimal">
          {members.map((member) => (
            <li key={member.id}>
              {member.username} - {member.name}
            </li>
          ))}
        </ol>

        <div className="divider" />
      </section>

      {Object.entries(submissionsPaginationsGroupedByAnswerTypes).map(
        ([type, pagination]) => {
          const key = `${type}|${
            pagination.current_page ?? pagination.meta?.current_page ?? 0
          }`;

          const answerType = Object.entries(AnswerTypes)
            .filter(([k, _]) => k === type)
            .map(([_, v]) => v)[0] as AnswerTypes;

          return (
            <section key={key} className="my-4">
              <h3 className="mb-4 text-2xl font-bold">
                <span className="capitalize">
                  {normalizeConstantCase(type)}
                </span>{" "}
                <span>Submissions</span>
              </h3>

              <SubmissionsViewByTeam
                answerType={answerType}
                currentPage={
                  pagination.current_page ?? pagination.meta?.current_page ?? 0
                }
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
