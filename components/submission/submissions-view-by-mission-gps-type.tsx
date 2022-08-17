import { TrashIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import PaginateResponseDto from "../../libs/dtos/paginate-response-dto";
import Submission from "../../libs/models/submission";
import PaginationButtons from "../common/pagination-buttons";

interface ISubmissionsViewByMissionGpsType {
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
  isLoading: boolean;
  onDelete: (submission: Submission) => void;
}

const SubmissionsViewByMissionGpsType: ComponentType<
  ComponentProps<"div"> & ISubmissionsViewByMissionGpsType
> = ({ currentPage, submissionsPaginated, isLoading, onDelete }) => {
  const router = useRouter();
  const gameId = router.query.gameId ?? "";

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Team</th>
              <th>Caption</th>
              <th>Points</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {submissionsPaginated.total === 0 && (
              <tr>
                <td className="text-center" colSpan={99}>
                  No submissions.
                </td>
              </tr>
            )}

            {submissionsPaginated.data.map((submission) => (
              <tr
                key={submission.id}
                className={`hover ${isLoading && "animate-pulse"}`}
              >
                <Link
                  href={`/games/${gameId}/submissions/team/${submission.game_team_id}`}
                >
                  <th className="link link-primary cursor-pointer">
                    {submission.game_team?.name}
                  </th>
                </Link>
                <td>{submission.caption}</td>
                <td>{submission.mission?.point_value}</td>
                <td>
                  <button
                    onClick={() => onDelete(submission)}
                    disabled={isLoading}
                    className={`btn btn-error gap-2 ${isLoading && "loading"}`}
                  >
                    {!isLoading && <TrashIcon className="h-5 w-5" />}
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-4">
        <PaginationButtons
          currentPage={currentPage}
          length={submissionsPaginated.last_page}
        />
      </section>
    </>
  );
};

export default SubmissionsViewByMissionGpsType;
