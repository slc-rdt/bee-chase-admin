import { PlusIcon } from "@heroicons/react/20/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import Pagination from "../../../../components/common/pagination";
import GameParticipantsAllowUserCreateTeamForm from "../../../../components/participants/game-participants-allow-user-create-team-form";
import GameParticipantsTeamOrSoloModeForm from "../../../../components/participants/game-participants-team-or-solo-mode-form";
import GameTeamCard from "../../../../components/participants/game-team-card";
import PaginateResponseDto from "../../../../libs/dtos/paginate-response-dto";
import Game from "../../../../libs/models/game";
import GameTeam from "../../../../libs/models/game-team";
import GameService from "../../../../libs/services/game-service";
import GameTeamService from "../../../../libs/services/game-team-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../libs/utils/handle-server-side-error";

const SearchBar = dynamic(
  () => import("../../../../components/common/search-bar")
);

export const getServerSideProps: GetServerSideProps<
  {
    page: number;
    game: Game;
    gameTeamsPaginated: PaginateResponseDto<GameTeam>;
  },
  { gameId: string }
> = async (context) => {
  try {
    const page = Number(context.query.page ?? 1);
    const q = context.query.q?.toString() ?? "";

    const [gameService, gameTeamService] = await Promise.all([
      createServerSideService(context.req, GameService),
      createServerSideService(context.req, GameTeamService),
    ]);

    const gameId = context.params?.gameId ?? "";

    const [game, gameTeamsPaginated] = await Promise.all([
      gameService.getOneById(gameId),
      gameTeamService.getAllPaginated(gameId, { page, q }),
    ]);

    return { props: { page, game, gameTeamsPaginated } };
  } catch (error) {
    return handleServerSideError(error, {
      destination: "/games",
      permanent: false,
    });
  }
};

const ParticipantsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ page, game, gameTeamsPaginated }) => {
  return (
    <div className="mx-auto max-w-screen-lg">
      <h2 className="mb-2 text-3xl font-bold">Participants</h2>

      <section className="card my-4 bg-primary-content shadow-xl">
        <div className="card-body">
          <p>
            Participants can join this Game by searching by join code:{" "}
            <span className="font-bold">{game.access_code}</span>.
          </p>
        </div>
      </section>

      <GameParticipantsTeamOrSoloModeForm game={game} />

      <div className="divider" />

      <section className="flex items-center gap-4">
        <h3 className="flex items-center gap-2">
          <span>Pre-create teams (optional)</span>

          <span
            className="tooltip"
            data-tip="If you're a more active organizer that has already split up your
            participants into teams, you may want to pre-create those teams here
            for your participants to join."
          >
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </span>
        </h3>

        <Link href={`/games/${game.id}/participants/create-team`}>
          <a className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Create Team
          </a>
        </Link>
      </section>

      <GameParticipantsAllowUserCreateTeamForm game={game} />

      <SearchBar pathname={`/games/${game.id}/participants`} />

      <section className="grid grid-cols-1 gap-4">
        <Pagination
          currentPage={page}
          pagination={gameTeamsPaginated}
          render={(gameTeam) => (
            <GameTeamCard key={gameTeam.id} gameTeam={gameTeam} />
          )}
        />
      </section>
    </div>
  );
};

export default ParticipantsPage;
