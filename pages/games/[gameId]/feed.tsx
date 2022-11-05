import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { InView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Submission from "../../../libs/models/submission";
import SubmissionService from "../../../libs/services/submission-service";

const SubmissionFeedCard = dynamic(
  () => import("../../../components/submission/feed/submission-feed-card")
);

const GameActivityFeed = () => {
  const router = useRouter();
  const submissionService = useService(SubmissionService);
  const { status } = useSession();
  const { isLoading, doAction } = useLoading();

  const gameId = router.query.gameId?.toString() ?? "";

  const { data, mutate, size, setSize, isValidating } = useSWRInfinite(
    (pageIndex, previousPageData: PaginateResponseDto<Submission> | null) => {
      if (status !== "authenticated") return null;

      const page = pageIndex + 1;

      if (previousPageData) {
        const lastPage =
          previousPageData.last_page ?? previousPageData.meta?.last_page ?? -1;
        if (page > lastPage) return null;
      }

      return [`feeds:${gameId}`, pageIndex + 1];
    },
    async (_, page) => {
      return await doAction(
        submissionService.getAllPaginatedByGame(gameId, {
          page,
          withUser: true,
        })
      );
    }
  );

  const isNoData = data?.flatMap((d) => d.data).length === 0;

  return (
    <div className="mx-auto max-w-screen-md">
      <h2 className="mb-4 text-3xl font-bold">Activity Feed</h2>

      {isNoData && !isValidating && (
        <section className="card shadow-xl">
          <div className="card-body">
            <h3 className="card-title justify-center">No data.</h3>
          </div>
        </section>
      )}

      {data?.map((pagination) => {
        const onDelete = (submission: Submission) => {
          const filtered = data.map((d) => {
            return {
              ...d,
              data: d.data.filter((s) => s.id !== submission.id),
            };
          });

          mutate(filtered);
        };

        return pagination.data.map((submission) => (
          <SubmissionFeedCard
            key={submission.id}
            submission={submission}
            onDelete={onDelete}
          />
        ));
      })}

      <InView
        as="section"
        onChange={() => setSize(size + 1)}
        className="my-4 flex justify-center"
      >
        <button
          onClick={() => setSize(size + 1)}
          className={`btn btn-primary ${isLoading && "loading"}`}
          disabled={isLoading || isNoData}
        >
          Load More
        </button>
      </InView>
    </div>
  );
};

export default GameActivityFeed;
