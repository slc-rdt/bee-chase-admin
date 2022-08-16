import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import React from "react";
import Pagination from "../../../../components/common/pagination";
import PaginateResponseDto from "../../../../libs/dtos/paginate-response-dto";
import Mission from "../../../../libs/models/mission";
import Submission from "../../../../libs/models/submission";
import MissionService from "../../../../libs/services/mission-service";
import SubmissionService from "../../../../libs/services/submission-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  { missionsPaginated: PaginateResponseDto<Mission>; page: number },
  { gameId: string; missionId: string }
> = async (context) => {
  const gameId = context.params?.gameId ?? "";
  const missionId = context.params?.missionId ?? "";
  const page = Number(context.query.page ?? 1);

  const missionService = await createServerSideService(
    context.req,
    MissionService
  );

  const missionsPaginated = await missionService.getAllPaginated(gameId, {
    page,
  });

  return {
    props: {
      missionsPaginated,
      page,
    },
  };
};

const SubmissionsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ missionsPaginated, page }) => {
  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Submissions</h2>

      <Pagination
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        currentPage={page}
        pagination={missionsPaginated}
        render={(mission) => (
          <div key={mission.id} className="card shadow-xl">
            <div className="card-body">
              <div className="card-title">{mission.name}</div>

              <p className="grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                <span className="badge">{mission.point_value} PTS</span>
                <span className="xl:text-right">
                  {mission.submissions?.length} submissions
                </span>
              </p>
            </div>
          </div>
        )}
      />
    </>
  );
};

export default SubmissionsPage;
