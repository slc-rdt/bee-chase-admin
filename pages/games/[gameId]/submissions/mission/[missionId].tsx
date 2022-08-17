import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import React from "react";
import Pagination from "../../../../../components/common/pagination";
import PaginationButtons from "../../../../../components/common/pagination-buttons";
import PaginateResponseDto from "../../../../../libs/dtos/paginate-response-dto";
import { MissionTypes } from "../../../../../libs/enums";
import Mission from "../../../../../libs/models/mission";
import Submission from "../../../../../libs/models/submission";
import SubmissionAnswerData from "../../../../../libs/models/submission-answer-data";
import MissionService from "../../../../../libs/services/mission-service";
import SubmissionService from "../../../../../libs/services/submission-service";
import createServerSideService from "../../../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  {
    gameId: string;
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
    submissionService.getAllPaginated(gameId, missionId, page),
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
> = ({ gameId, page, mission, submissionsPaginated }) => {
  return (
    <>
      <header className="mb-4 text-center">
        <h2 className="mb-2 text-3xl font-bold">{mission?.name}</h2>
        <p>
          {submissionsPaginated.total} submissions | {mission?.point_value}{" "}
          points
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Team</th>
              {mission?.answer_type === MissionTypes.TEXT && <th>Answer</th>}
              <th>Caption</th>
              <th>Points</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {submissionsPaginated.total === 0 && (
              <tr>
                <td className="text-center" colSpan={99}>
                  No submissions.
                </td>
              </tr>
            )}

            {submissionsPaginated.data.map((submission) => (
              <tr key={submission.id} className="hover">
                <Link
                  href={`/games/${gameId}/submissions/team/${submission.game_team_id}`}
                >
                  <th className="link link-primary cursor-pointer">
                    {submission.game_team?.name}
                  </th>
                </Link>

                {submission.mission?.answer_type === MissionTypes.TEXT && (
                  <td>
                    {typeof submission.answer_data === "string"
                      ? JSON.parse(submission.answer_data).answer
                      : submission.answer_data.answer}
                  </td>
                )}

                <td>{submission.caption}</td>
                <td>{submission.mission?.point_value}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="mt-4">
          <PaginationButtons
            currentPage={page}
            length={submissionsPaginated.last_page}
          />
        </section>
      </div>
    </>
  );
};

export default SubmissionsByMissionPage;
