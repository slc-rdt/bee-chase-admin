import { NextPage } from "next";
import React from "react";
import GameForm from "../../components/game/game-form";
import Layout from "../../components/layouts/layout";

const GameCreatePage: NextPage = () => {
  return (
    <Layout>
      <h2 className="text-3xl font-bold">Details</h2>

      <GameForm />
    </Layout>
  );
};

export default GameCreatePage;
