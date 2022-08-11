import { NextPage } from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import GameForm from "../../components/game/game-form";
import Layout from "../../components/layouts/layout";
import CreateGameDto from "../../libs/dtos/create-game-dto";
import useLoading from "../../libs/hooks/useLoading";
import useService from "../../libs/hooks/useService";
import GameService from "../../libs/services/game-service";

const GameCreatePage: NextPage = () => {
  const router = useRouter();
  const gameService = useService(GameService);

  const { isLoading, doAction } = useLoading();

  const onGameFormSubmit = async (data: CreateGameDto) => {
    const response = await toast.promise(
      doAction(async () => await gameService.create(data)),
      {
        loading: "Creating game...",
        success: "Game created!",
        error: "Failed to create game.",
      }
    );

    router.push(`/games/${response.id}/missions`);
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold">Details</h2>

      <GameForm isLoading={isLoading} onGameFormSubmit={onGameFormSubmit} />
    </Layout>
  );
};

export default GameCreatePage;
