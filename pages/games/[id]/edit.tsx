import GameForm from "../../../components/game/game-form";
import Layout from "../../../components/layouts/layout";

const GameDetailEditPage = () => {
  return (
    <Layout>
      <h2 className="text-3xl font-bold">Details</h2>

      <GameForm />
    </Layout>
  );
};

export default GameDetailEditPage;
