import { ArrowDownOnSquareIcon } from "@heroicons/react/20/solid";
import { AxiosError } from "axios";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import Skeleton from "../components/common/skeleton";
import useDownloadBlob from "../libs/hooks/common/use-download-blob";
import useLoading from "../libs/hooks/common/use-loading";
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
  const tagService = useService(TagService);
  const downloadBlob = useDownloadBlob();
  const { status } = useSession();
  const { isLoading, doAction } = useLoading();
  const [tag, setTag] = useState<Tag | null>(tags[0]);

  const onExport = async () => {
    if (!tag) {
      toast.error("Please select a tag first.");
      return;
    }

    const exported = await doAction(tagService.exportGlobalLeaderboard(tag));
    downloadBlob(...exported);
  };

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
      <header className="flex flex-wrap justify-between">
        <h2 className="mb-4 text-3xl font-bold">Global Leaderboard</h2>

        <button
          onClick={onExport}
          disabled={isLoading}
          className={`btn btn-secondary gap-2 ${isLoading && "loading"}`}
        >
          {!isLoading && <ArrowDownOnSquareIcon className="h-5 w-5" />}
          Export global leaderboard
        </button>
      </header>

      <section className="form-control mb-4 w-full">
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
