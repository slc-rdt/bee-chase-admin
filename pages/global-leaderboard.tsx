import { AxiosError } from "axios";
import { DateTime } from "luxon";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import Skeleton from "../components/common/skeleton";
import useService from "../libs/hooks/common/use-service";
import Tag from "../libs/models/tag";
import TagService from "../libs/services/tag-service";
import createServerSideService from "../libs/utils/create-server-side-service";
import getRankSuffix from "../libs/utils/get-rank-suffix";
import handleServerSideError from "../libs/utils/handle-server-side-error";

const GlobalLeaderboardExportButton = dynamic(
  () =>
    import("../components/global-leaderboard/global-leaderboard-export-button")
);
const GlobalLeaderboardFilterForm = dynamic(
  () =>
    import("../components/global-leaderboard/global-leaderboard-filter-form")
);

export const getServerSideProps: GetServerSideProps<{
  tags: Tag[];
  usersWithPointsMoreThan500Count: number;
}> = async (context) => {
  try {
    const tagService = await createServerSideService(context.req, TagService);

    const tags = await tagService.getAll();

    const globalLeaderboards = await Promise.all(
      tags.map((tag) => tagService.getGlobalLeaderboard(tag, { limit: -1 }))
    ).then((result) => result.flatMap((x) => x));

    const usersWithPointsMoreThan500Count = globalLeaderboards.filter(
      (leaderboard) => leaderboard.total_point >= 500
    ).length;

    return { props: { tags, usersWithPointsMoreThan500Count } };
  } catch (error) {
    return handleServerSideError(error);
  }
};

export interface IGlobalLeaderboardFilterFormValues {
  tagId?: string;
  startDate: string;
  endDate: string;
}

const GlobalLeaderboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ tags, usersWithPointsMoreThan500Count }) => {
  const now = DateTime.now();

  const tagService = useService(TagService);
  const { status } = useSession();

  const { register, watch } = useForm<IGlobalLeaderboardFilterFormValues>({
    defaultValues: {
      tagId: tags[0]?.id,
      startDate: now.toISODate(),
      endDate: now.plus({ days: 1 }).toISODate(),
    },
  });

  const tagId = watch("tagId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const tag = tags.find((tag) => tag.id === tagId);

  const { data, error } = useSWR(
    tag && status === "authenticated"
      ? ["global-leaderboard", tag, startDate, endDate]
      : null,
    async (_, tag, startDate, endDate) =>
      await tagService.getGlobalLeaderboard(tag, {
        page: 1,
        start_date: startDate,
        end_date: endDate,
      })
  );

  if (error instanceof AxiosError) {
    toast.error(error.message, { id: `global-leaderboard:${tag?.id}` });
  }

  return (
    <div className="mx-auto max-w-screen-md">
      <header className="flex flex-wrap justify-between">
        <h2 className="mb-4 text-3xl font-bold">Global Leaderboard</h2>

        <GlobalLeaderboardExportButton tag={tag} />
      </header>

      <div className="divider" />

      <section className="flex justify-center">
        <div className="stats my-4 shadow">
          <div className="stat place-items-center">
            <div className="stat-title">Users with score ≥ 500</div>
            <div className="stat-value">
              {usersWithPointsMoreThan500Count.toLocaleString()}
            </div>
            <div className="stat-desc">
              Students who had accessed BeeChase, did activities, and receive
              points (as of{" "}
              {now.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}).
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <GlobalLeaderboardFilterForm {...{ register, tags }} />

      <div className="divider" />

      <section className="grid grid-cols-1 gap-4">
        {!data &&
          Array.from({ length: 15 }).map((_, idx) => (
            <Skeleton key={idx} className="h-16 w-full" />
          ))}

        {data && data.length === 0 && (
          <div className="card shadow-xl">
            <div className="card-body">
              <header className="card-header">No data.</header>
            </div>
          </div>
        )}

        {data?.map((user) => {
          const rankSuffix = getRankSuffix(user.rank);
          return (
            <div key={user.id} className="card shadow-xl">
              <div className="card-body">
                <div className="flex flex-wrap justify-between text-lg font-bold">
                  <Link href={`/users/${user.id}/games`}>
                    <a className="link link-primary">
                      #{user.rank}
                      {rankSuffix} {user.name}
                    </a>
                  </Link>

                  <section>{user.total_point.toLocaleString()} points</section>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default GlobalLeaderboard;
