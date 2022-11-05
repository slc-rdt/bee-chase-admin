import { PlusIcon } from "@heroicons/react/20/solid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Pagination from "../../../../components/common/pagination";
import MissionCard from "../../../../components/mission/card/mission-card";
import PaginateResponseDto from "../../../../libs/dtos/paginate-response-dto";
import useLoading from "../../../../libs/hooks/common/use-loading";
import useService from "../../../../libs/hooks/common/use-service";
import Mission from "../../../../libs/models/mission";
import MissionService from "../../../../libs/services/mission-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";
import getCurrentPageIndexFromPagination from "../../../../libs/utils/get-current-page-index-from-pagination";
import handleServerSideError from "../../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  {
    page: number;
    gameId: string;
    paginatedMissions: PaginateResponseDto<Mission>;
  },
  { gameId: string }
> = async (context) => {
  try {
    const missionService = await createServerSideService(
      context.req,
      MissionService
    );

    const gameId = context.params?.gameId ?? "";
    const page = Number(context.query.page ?? 1);

    const paginatedMissions = await missionService.getAllPaginated(gameId, {
      page,
    });

    return {
      props: {
        page,
        gameId,
        paginatedMissions,
      },
    };
  } catch (error) {
    return handleServerSideError(error, {
      destination: "/games",
      permanent: false,
    });
  }
};

const MissionsPage = ({
  page,
  gameId,
  paginatedMissions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const missionService = useService(MissionService);
  const { isLoading, doAction } = useLoading();

  const total = paginatedMissions.total ?? paginatedMissions.meta?.total ?? -1;

  const swapMissionIndex = async (mission: Mission, targetIndex: number) => {
    await doAction(
      Promise.all([
        missionService.swapMissionIndex(mission, targetIndex),
        router.push(router.asPath),
      ])
    );
  };

  return (
    <div className="mx-auto max-w-screen-lg">
      <section className="flex flex-wrap justify-between">
        <h2 className="mb-4 text-3xl font-bold">Mission</h2>
        <Link href={`/games/${router.query.gameId}/missions/create`}>
          <a className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Mission
          </a>
        </Link>
      </section>

      <section className="flex">
        <div className="tabs tabs-boxed">
          <Link href={`/games/${gameId}/missions`}>
            <a className="tab tab-active">Mission List</a>
          </Link>
          <Link href={`/games/${gameId}/missions/previous`}>
            <a className="tab">Previous Missions</a>
          </Link>
        </div>
      </section>

      <Pagination
        pagination={paginatedMissions}
        currentPage={page}
        render={(mission, idx) => {
          const currentPageIdx = getCurrentPageIndexFromPagination(
            idx,
            paginatedMissions
          );
          const number = currentPageIdx + 1;

          return (
            <MissionCard
              key={mission.id}
              mission={mission}
              number={number}
              isLoading={isLoading}
              onPressUp={
                number > 1
                  ? () => swapMissionIndex(mission, currentPageIdx - 1)
                  : undefined
              }
              onPressDown={
                number < total
                  ? () => swapMissionIndex(mission, currentPageIdx + 1)
                  : undefined
              }
              editable
              deletable
              showAvailability
            />
          );
        }}
      />
    </div>
  );
};

export default MissionsPage;
