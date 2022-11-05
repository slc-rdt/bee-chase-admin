import { ArrowDownOnSquareIcon } from "@heroicons/react/20/solid";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import Pagination from "../../../../components/common/pagination";
import MissionIcon from "../../../../components/mission/mission-icon";
import PaginateResponseDto from "../../../../libs/dtos/paginate-response-dto";
import useDownloadBlob from "../../../../libs/hooks/common/use-download-blob";
import useLoading from "../../../../libs/hooks/common/use-loading";
import useService from "../../../../libs/hooks/common/use-service";
import Mission from "../../../../libs/models/mission";
import GameService from "../../../../libs/services/game-service";
import MissionService from "../../../../libs/services/mission-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  {
    gameId: string;
    missionsPaginated: PaginateResponseDto<Mission>;
    page: number;
  },
  { gameId: string }
> = async (context) => {
  try {
    const gameId = context.params?.gameId ?? "";
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
        gameId,
        missionsPaginated,
        page,
      },
    };
  } catch (error) {
    return handleServerSideError(error, {
      destination: "/games",
      permanent: false,
    });
  }
};

const SubmissionsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameId, missionsPaginated, page }) => {
  const gameService = useService(GameService);
  const downloadBlob = useDownloadBlob();
  const { isLoading, doAction } = useLoading();

  const onExport = async () => {
    const exportedGame = await doAction(gameService.exportSubmissions(gameId));
    downloadBlob(...exportedGame);
  };

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="mb-2 text-3xl font-bold">Submissions</h2>

        <button
          onClick={onExport}
          disabled={isLoading}
          className={`btn btn-secondary gap-2 ${isLoading && "loading"}`}
        >
          {!isLoading && <ArrowDownOnSquareIcon className="h-5 w-5" />}
          Export submissions
        </button>
      </header>

      <Pagination
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        currentPage={page}
        pagination={missionsPaginated}
        render={(mission) => (
          <Link
            key={mission.id}
            href={`/games/${gameId}/submissions/mission/${mission.id}`}
          >
            <a className="card shadow-xl">
              <div className="card-body">
                <h3 className="card-title">
                  <MissionIcon mission={mission} />
                  <span>{mission.name}</span>
                  </h3>

                <p className="grid grid-cols-1 items-center gap-4 xl:grid-cols-2">
                  <span className="badge badge-primary">
                    {mission.point_value} PTS
                  </span>
                  <span className="xl:text-right">
                    {mission.submissions?.length} submissions
                  </span>
                </p>
              </div>
            </a>
          </Link>
        )}
      />
    </>
  );
};

export default SubmissionsPage;
