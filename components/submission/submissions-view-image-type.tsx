import { TrashIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import Submission from "../../libs/models/submission";
import Pagination from "../common/pagination";

interface ISubmissionsViewTextType {
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
}

const SubmissionsViewImageType: ComponentType<
  ComponentProps<"div"> & ISubmissionsViewTextType
> = ({ currentPage, submissionsPaginated }) => {
  const router = useRouter();
  const gameId = router.query.gameId ?? "";

  return (
    <Pagination
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      currentPage={currentPage}
      pagination={submissionsPaginated}
      render={(submission) => (
        <div key={submission.id} className="card bg-base-100 shadow-xl">
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
              href={`/games/${gameId}/submissions/team/${submission.game_team_id}`}
            >
              <h2 className="link card-title link-primary">
                {submission.game_team?.name}
              </h2>
            </Link>

            <p>
              <span className="badge badge-primary">
                {submission.mission?.point_value} PTS
              </span>
            </p>

            <div className="card-actions justify-end">
              <button className="btn btn-error gap-2">
                <TrashIcon className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default SubmissionsViewImageType;
