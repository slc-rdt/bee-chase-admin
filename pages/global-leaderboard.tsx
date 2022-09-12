import { AxiosError } from "axios";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import Skeleton from "../components/common/skeleton";
import useService from "../libs/hooks/common/use-service";
import Tag from "../libs/models/tag";
import TagService from "../libs/services/tag-service";
import createServerSideService from "../libs/utils/create-server-side-service";
import getRankSuffix from "../libs/utils/get-rank-suffix";
import handleServerSideError from "../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<{ tags: Tag[] }> = async (
  context
) => {
  try {
    const tagService = await createServerSideService(context.req, TagService);
    const tags = await tagService.getAll();
    return { props: { tags } };
  } catch (error) {
    return handleServerSideError(error);
  }
};

const GlobalLeaderboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ tags }) => {
  const { status } = useSession();
  const tagService = useService(TagService);
  const [tag, setTag] = useState<Tag | null>(tags[0]);

  const { data, error } = useSWR(
    tag && status === "authenticated" ? ["global-leaderboard", tag] : null,
    async (_, tag) => await tagService.getGlobalLeaderboard(tag, { page: 1 })
  );

  const onSelectTag = (tagId: string) => {
    const selectedTag = tags.find((tag) => tag.id === tagId);
    if (selectedTag) {
      setTag(selectedTag);
    } else {
      toast.error(`Tag not found [tagId: ${tagId}].`);
    }
  };

  if (error instanceof AxiosError) {
    toast.error(error.message, { id: `global-leaderboard:${tag?.id}` });
  }

  return (
    <div className="mx-auto max-w-screen-md">
      <section className="form-control w-full">
        <label className="label">
          <span className="label-text">Leaderboard Tag</span>
        </label>
        <select
          className="select select-bordered"
          onChange={(e) => onSelectTag(e.target.value)}
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <label className="label">
          <span className="label-text-alt">
            Choose a tag to filter the leaderboard.
          </span>
        </label>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4">
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

        {data &&
          data.map((item) => {
            const rankSuffix = getRankSuffix(item.rank);
            return (
              <div key={item.id} className="card shadow-xl">
                <div className="card-body">
                  <div className="flex flex-wrap justify-between text-lg font-bold">
                    <section>
                      #{item.rank}
                      {rankSuffix} {item.name}
                    </section>

                    <section>{Number(item.total_point).toLocaleString()} points</section>
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
