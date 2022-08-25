import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import MissionCard from "../../../../components/mission/card/mission-card";
import Game from "../../../../libs/models/game";
import Mission from "../../../../libs/models/mission";
import GameService from "../../../../libs/services/game-service";
import MissionService from "../../../../libs/services/mission-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  {
    originalGameId: string;
    selectedGameId: string;
    games: Game[];
    missions: Mission[];
  },
  { gameId: string }
> = async (context) => {
  try {
    const [gameService, missionService] = await Promise.all([
      createServerSideService(context.req, GameService),
      createServerSideService(context.req, MissionService),
    ]);

    const allGames = await gameService.getAll();
    const originalGameId = context.params?.gameId ?? "";
    const games = allGames.filter((game) => game.id !== originalGameId);
    const selectedGameId = context.query.selectedGameId ?? games[0]?.id ?? "";

    const [originalGameMissions, selectedGameMissions] = await Promise.all([
      missionService.getAll(originalGameId.toString()),
      missionService.getAll(selectedGameId.toString()),
    ]);

    const missions = selectedGameMissions.filter((parentMission) =>
      originalGameMissions.every(
        (mission) => parentMission.id !== mission.parent_mission_id
      )
    );

    return {
      props: {
        originalGameId,
        selectedGameId,
        games,
        missions,
      },
    };
  } catch (error) {
    return handleServerSideError(error, {
      destination: "/games",
      permanent: false,
    });
  }
};

const PreviousMissionsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ originalGameId, selectedGameId, games, missions }) => {
  const router = useRouter();

  const onChangeGame = (gameId: string) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        selectedGameId: gameId,
      },
    });
  };

  return (
    <div className="mx-auto grid max-w-screen-lg grid-cols-1 gap-4">
      <h2 className="text-3xl font-bold">Mission</h2>

      <section className="flex">
        <div className="tabs tabs-boxed">
          <Link href={`/games/${originalGameId}/missions`}>
            <a className="tab">Mission List</a>
          </Link>
          <Link href={`/games/${originalGameId}/missions/previous`}>
            <a className="tab tab-active">Previous Missions</a>
          </Link>
        </div>
      </section>

      <section>
        <select
          onChange={(e) => onChangeGame(e.target.value)}
          className="select select-bordered select-primary"
          defaultValue={selectedGameId}
          disabled={!selectedGameId}
        >
          {games.length === 0 && <option>No games.</option>}

          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </section>

      <section className="grid grid-cols-1 gap-4">
        {missions.length === 0 && (
          <div className="card shadow-xl">
            <div className="card-body">
              <h3 className="card-title justify-center">No missions.</h3>
            </div>
          </div>
        )}

        {missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} clonable />
        ))}
      </section>
    </div>
  );
};

export default PreviousMissionsPage;
