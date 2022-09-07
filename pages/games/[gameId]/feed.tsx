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

  const { data, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData: PaginateResponseDto<Submission> | null) => {
      if (status !== "authenticated") return null;

      const page = pageIndex + 1;

      if (previousPageData) {
        const lastPage =
          previousPageData.last_page ?? previousPageData.meta?.last_page ?? -1;
        if (page > lastPage) return null;
      }

      return ["feeds", pageIndex + 1];
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

  return (
    <div className="mx-auto max-w-screen-md">
      <h2 className="mb-4 text-3xl font-bold">Activity Feed</h2>

      {data
        ?.flatMap((d) => d.data)
        .map((submission) => (
          <SubmissionFeedCard key={submission.id} submission={submission} />
        ))}

      <InView
        as="section"
        onChange={() => setSize(size + 1)}
        className="my-4 flex justify-center"
      >
        <button
          onClick={() => setSize(size + 1)}
          className={`btn btn-primary ${isLoading && "loading"}`}
          disabled={isLoading}
        >
          Load More
        </button>
      </InView>
    </div>
  );
};

export default GameActivityFeed;
