import { ArrowDownOnSquareIcon } from "@heroicons/react/20/solid";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import useDownloadBlob from "../../../libs/hooks/common/use-download-blob";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import GameTeam from "../../../libs/models/game-team";
import GameService from "../../../libs/services/game-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";
import getRankSuffix from "../../../libs/utils/get-rank-suffix";
import handleServerSideError from "../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  { gameId: string; leaderboard: GameTeam[] },
  { gameId: string }
> = async (context) => {
  try {
    const gameId = context.params?.gameId ?? "";
    const gameService = await createServerSideService(context.req, GameService);
    const leaderboard = await gameService.getLeaderboard(gameId, {});
    return { props: { gameId, leaderboard } };
  } catch (error) {
    return handleServerSideError(error, {
      destination: `/games`,
      permanent: false,
    });
  }
};

const Leaderboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameId, leaderboard }) => {
  const gameService = useService(GameService);
  const downloadBlob = useDownloadBlob();
  const { isLoading, doAction } = useLoading();

  const onExport = async () => {
    const exportedGame = await doAction(gameService.exportLeaderboard(gameId));
    downloadBlob(...exportedGame);
  };

  return (
    <div className="mx-auto max-w-screen-lg">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Leaderboard</h2>

        <button
          onClick={onExport}
          disabled={isLoading}
          className={`btn btn-secondary gap-2 ${isLoading && "loading"}`}
        >
          {!isLoading && <ArrowDownOnSquareIcon className="h-5 w-5" />}
          Export leaderboard
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4">
        {leaderboard.length === 0 && (
          <div className="card shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">No data.</h2>
            </div>
          </div>
        )}

        {leaderboard.map((gameTeam) => {
          const rankSuffix = getRankSuffix(gameTeam.rank ?? 0);

          return (
            <div key={gameTeam.id} className="card shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <section>
                    <div
                      className={`h-10 w-10 rounded-full ${
                        !gameTeam.color && "bg-base-300"
                      }`}
                      style={{ backgroundColor: gameTeam.color }}
                    />
                  </section>

                  <section className="flex-grow">
                    <Link
                      href={`/games/${gameId}/submissions/team/${gameTeam.id}`}
                    >
                      <a className="link card-title link-primary">
                        {gameTeam.name}
                      </a>
                    </Link>
                    <p>
                      {Number(
                        gameTeam.missions_sum_point_value ?? 0
                      ).toLocaleString()}{" "}
                      points
                    </p>
                  </section>

                  <section className="text-lg font-bold">
                    {gameTeam.rank}
                    {rankSuffix}
                  </section>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Leaderboard;
