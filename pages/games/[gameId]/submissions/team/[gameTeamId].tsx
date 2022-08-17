import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import React from "react";
import SubmissionsView from "../../../../../components/submission/submissions-view";
import SubmissionsViewImageType from "../../../../../components/submission/submissions-view-image-type";
import PaginateResponseDto from "../../../../../libs/dtos/paginate-response-dto";
import { MissionTypes } from "../../../../../libs/enums";
import GameTeam from "../../../../../libs/models/game-team";
import Submission from "../../../../../libs/models/submission";
import GameTeamService from "../../../../../libs/services/game-team-service";
import SubmissionService from "../../../../../libs/services/submission-service";
import createServerSideService from "../../../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  {
    page: number;
    gameTeam: GameTeam;
    submissionsPaginations: PaginateResponseDto<Submission>[];
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

  const missionTypeValues = Object.values(MissionTypes)
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

  return {
    props: {
      page,
      gameTeam,
      submissionsPaginations,
    },
  };
};

const SubmissionsByGameTeamPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ page, gameTeam, submissionsPaginations }) => {
  const totalSubmissions = submissionsPaginations
    .map((x) => x.total)
    .reduce((a, b) => a + b);

  return (
    <>
      <header className="mb-4 text-center">
        <h2 className="mb-2 text-3xl font-bold">{gameTeam.name}</h2>
        <p>
          {totalSubmissions} submissions
          {/* !TODO! | {totalPointsSum} points */}
        </p>
      </header>

      {submissionsPaginations.map((submissionsPagination, idx) => {
        if (submissionsPagination.total === 0) {
          return null;
        }

        const firstSubmission = submissionsPagination.data[0];
        const answerType = firstSubmission.mission?.answer_type;

        if (!answerType) {
          return null;
        }

        return (
          <SubmissionsView
            key={answerType}
            answerType={answerType}
            currentPage={page}
            submissionsPaginated={submissionsPagination}
          />
        );
      })}
    </>
  );
};

export default SubmissionsByGameTeamPage;
