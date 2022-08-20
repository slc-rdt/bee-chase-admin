import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import React from "react";
import Pagination from "../../../../components/common/pagination";
import MissionCard from "../../../../components/mission/card/mission-card";
import PaginateResponseDto from "../../../../libs/dtos/paginate-response-dto";
import Mission from "../../../../libs/models/mission";
import MissionService from "../../../../libs/services/mission-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";
import getServerSidePropsWrapper from "../../../../libs/utils/get-server-side-props-wrapper";

export const getServerSideProps: GetServerSideProps<
  {
    page: number;
    gameId: string;
    missionsPaginated: PaginateResponseDto<Mission>;
  },
  { gameId: string }
> = async (context) => {
  return await getServerSidePropsWrapper(
    async () => {
      const missionService = await createServerSideService(
        context.req,
        MissionService
      );

      const gameId = context.params?.gameId ?? "";
      const page = Number(context.query.page ?? 1);

      const missionsPaginated = await missionService.getAllPaginated(gameId, {
        page,
      });

      return {
        props: {
          page,
          gameId,
          missionsPaginated,
        },
      };
    },
    {
      destination: "/games",
      permanent: false,
    }
  );
};

const PreviousMissionsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ page, gameId, missionsPaginated }) => {
  return (
    <div className="mx-auto max-w-screen-lg">
      <h2 className="mb-3 text-3xl font-bold">Mission</h2>

      <section className="flex">
        <div className="tabs tabs-boxed">
          <Link href={`/games/${gameId}/missions`}>
            <a className="tab">Mission List</a>
          </Link>
          <Link href={`/games/${gameId}/missions/previous`}>
            <a className="tab tab-active">Previous Missions</a>
          </Link>
        </div>
      </section>

      <Pagination
        currentPage={page}
        pagination={missionsPaginated}
        render={(mission) => (
          <MissionCard key={mission.id} mission={mission} clonable />
        )}
      />
    </div>
  );
};

export default PreviousMissionsPage;
