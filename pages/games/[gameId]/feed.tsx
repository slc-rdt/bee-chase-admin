import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from "next";
import Pagination from "../../../components/common/pagination";
import SubmissionFeedCard from "../../../components/submission/feed/submission-feed-card";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import Submission from "../../../libs/models/submission";
import SubmissionService from "../../../libs/services/submission-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  {
    page: number;
    submissionsPaginated: PaginateResponseDto<Submission>;
  },
  {
    gameId: string;
  }
> = async (context) => {
  try {
    const gameId = context.params?.gameId ?? "";
    const page = Number(context.query.page ?? 1);

    const submissionService = await createServerSideService(
      context.req,
      SubmissionService
    );

    const submissionsPaginated = await submissionService.getAllPaginatedByGame(
      gameId,
      { page }
    );

    return {
      props: {
        page,
        submissionsPaginated,
      },
    };
  } catch (error) {
    return handleServerSideError(error, {
      destination: "/games",
      permanent: false,
    });
  }
};

const GameActivityFeed: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ page, submissionsPaginated }) => {
  return (
    <div className="mx-auto max-w-screen-md">
      <h2 className="mb-4 text-3xl font-bold">Activity Feed</h2>

      <Pagination
        currentPage={page}
        pagination={submissionsPaginated}
        render={(submission) => (
          <SubmissionFeedCard key={submission.id} submission={submission} />
        )}
      />
    </div>
  );
};

export default GameActivityFeed;
