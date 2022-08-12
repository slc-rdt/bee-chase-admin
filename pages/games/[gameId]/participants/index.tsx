import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../../components/layouts/layout";

const ParticipantsPage = () => {
  const router = useRouter();
  const gameId = router.query.gameId;
  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Participants</h2>

      <Link href={`/games/${gameId}/participants/create-team`}>
        <button className="btn btn-primary">Create Team</button>
      </Link>
    </Layout>
  );
};

export default ParticipantsPage;
