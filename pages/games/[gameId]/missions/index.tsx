import { PlusIcon } from "@heroicons/react/solid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Pagination from "../../../../components/common/pagination";
import MissionCard from "../../../../components/mission/mission-card";
import PaginateResponseDto from "../../../../libs/dtos/paginate-response-dto";
import Mission from "../../../../libs/models/mission";
import MissionService from "../../../../libs/services/mission-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";

export const getServerSideProps: GetServerSideProps<
  { page: number; paginatedMissions: PaginateResponseDto<Mission> },
  { gameId: string }
> = async (context) => {
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
      paginatedMissions,
    },
  };
};

const MissionsPage = ({
  page,
  paginatedMissions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <>
      <section className="flex flex-wrap justify-between">
        <h2 className="mb-2 text-3xl font-bold">Mission</h2>
        <Link href={`/games/${router.query.gameId}/missions/create`}>
          <button className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Mission
          </button>
        </Link>
      </section>

      <Pagination
        pagination={paginatedMissions}
        currentPage={page}
        render={(mission) => <MissionCard key={mission.id} mission={mission} />}
      />
    </>
  );
};

export default MissionsPage;
