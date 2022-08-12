import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Layout from "../../../../components/layouts/layout";
import useLoading from "../../../../libs/hooks/use-loading";
import useService from "../../../../libs/hooks/use-service";
import GameTeam from "../../../../libs/models/game-team";
import GameTeamService from "../../../../libs/services/game-team-service";

const ParticipantsCreateTeamPage = () => {
  const router = useRouter();
  const teamService = useService(GameTeamService);
  const { register, handleSubmit } = useForm<GameTeam>();
  const { isLoading, doAction } = useLoading();

  const onSubmit = handleSubmit(async (data) => {
    const game_id = router.query.gameId?.toString() ?? "";

    await toast.promise(
      doAction(async () => await teamService.create({ ...data, game_id })),
      {
        loading: "Creating team...",
        success: "Team created!",
        error: "Failed to created team.",
      }
    );

    router.push(`/games/${game_id}/participants`);
  });

  return (
    <Layout>
      <h2 className="mb-2 text-3xl font-bold">Create Team</h2>

      <div className="card">
        <form onSubmit={onSubmit} className="card-body">
          <section className="w-fulle form-control">
            <label className="label">
              <span className="label-text">Team Color</span>
            </label>
            <input
              {...register("color")}
              type="color"
              className="input input-bordered w-full"
              disabled={isLoading}
              required
            />
          </section>

          <section className="w-fulle form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              {...register("name")}
              type="text"
              className="input input-bordered w-full"
              disabled={isLoading}
              required
            />
          </section>

          <section className="w-fulle form-control">
            <label className="label">
              <span className="label-text">Passcode (Optional)</span>
            </label>
            <input
              {...register("access_code")}
              type="text"
              className="input input-bordered w-full"
              disabled={isLoading}
              minLength={4}
            />
          </section>

          <div className="card-actions justify-end">
            <button
              type="submit"
              className={`btn btn-primary ${isLoading && "loading"}`}
              disabled={isLoading}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ParticipantsCreateTeamPage;
