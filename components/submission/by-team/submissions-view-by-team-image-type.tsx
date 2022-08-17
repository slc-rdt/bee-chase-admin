import { TrashIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import Submission from "../../../libs/models/submission";
import Pagination from "../../common/pagination";

interface ISubmissionsViewByTeamTextType {
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
  isLoading: boolean;
  onDelete: (submission: Submission) => void;
}

const SubmissionsViewByTeamImageType: ComponentType<
  ComponentProps<"div"> & ISubmissionsViewByTeamTextType
> = ({ currentPage, submissionsPaginated, isLoading, onDelete }) => {
  const router = useRouter();
  const gameId = router.query.gameId ?? "";

  return (
    <Pagination
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      currentPage={currentPage}
      pagination={submissionsPaginated}
      render={(submission) => (
        <div
          key={submission.id}
          className={`card bg-base-100 shadow-xl ${
            isLoading && "animate-pulse"
          }`}
        >
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                typeof submission.answer_data === "string"
                  ? JSON.parse(submission.answer_data).urls?.at(0)
                  : submission.answer_data.urls?.at(0)
              }
              alt="submission image"
            />
          </figure>

          <div className="card-body">
            <Link
              href={`/games/${gameId}/submissions/mission/${submission.mission_id}`}
            >
              <h2 className="link card-title link-primary">
                {submission.mission?.name}
              </h2>
            </Link>

            <p>
              <span className="badge badge-primary">
                {submission.mission?.point_value} PTS
              </span>
            </p>

            <div className="card-actions justify-end">
              <button
                onClick={() => onDelete(submission)}
                disabled={isLoading}
                className={`btn btn-error gap-2 ${isLoading && "loading"}`}
              >
                {!isLoading && <TrashIcon className="h-5 w-5" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default SubmissionsViewByTeamImageType;
