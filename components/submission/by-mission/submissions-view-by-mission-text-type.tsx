import { TrashIcon } from "@heroicons/react/20/solid";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import useFormattedDate from "../../../libs/hooks/common/use-formatted-date";
import useLoading from "../../../libs/hooks/common/use-loading";
import Submission from "../../../libs/models/submission";
import parseJsonIfString from "../../../libs/utils/parse-json-if-string";
import ConfirmationModal from "../../common/confirmation-modal";
import PaginationButtons from "../../common/pagination-buttons";

interface ISubmissionsViewByMissionTextType {
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
  onDelete: (submission: Submission) => Promise<void>;
}

const SubmissionsViewByMissionTextType: ComponentType<
  ComponentProps<"div"> & ISubmissionsViewByMissionTextType
> = ({ currentPage, submissionsPaginated, onDelete }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Team</th>
              <th>Answer</th>
              <th>Caption</th>
              <th>Points</th>
              <th>Submitted At</th>
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
              <TextSubmissionItem
                key={submission.id}
                submission={submission}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-4">
        <PaginationButtons
          currentPage={currentPage}
          length={
            submissionsPaginated.last_page ??
            submissionsPaginated.meta?.last_page ??
            0
          }
        />
      </section>
    </>
  );
};

interface ITextSubmissionItem {
  submission: Submission;
  onDelete: (submission: Submission) => Promise<void>;
}

const TextSubmissionItem: ComponentType<
  ComponentProps<"tr"> & ITextSubmissionItem
> = ({ submission, onDelete, ...rest }) => {
  const router = useRouter();
  const { isLoading, doAction } = useLoading();

  const createdAtFormatted = useFormattedDate(
    submission.created_at,
    DateTime.DATETIME_HUGE_WITH_SECONDS
  );

  const gameId = router.query.gameId ?? "";

  const onDeleteClicked = async (submission: Submission) => {
    await doAction(onDelete(submission));
  };

  return (
    <tr
      key={submission.id}
      className={`hover ${isLoading && "animate-pulse"}`}
      {...rest}
    >
      <th className="link link-primary cursor-pointer">
        <Link
          href={`/games/${gameId}/submissions/team/${submission.game_team_id}`}
        >
          <a className="whitespace-pre-wrap">{submission.game_team?.name}</a>
        </Link>
      </th>

      <td>{parseJsonIfString(submission.answer_data).text}</td>

      <td>{submission.caption}</td>
      <td>{submission.mission?.point_value}</td>
      <td>{createdAtFormatted}</td>
      <td>
        <ConfirmationModal
          className="btn btn-error gap-2"
          modalKey={submission.id}
          isLoading={isLoading}
          onConfirm={() => onDeleteClicked(submission)}
        >
          <TrashIcon className="h-5 w-5" />
          Delete
        </ConfirmationModal>
      </td>
    </tr>
  );
};

export default SubmissionsViewByMissionTextType;
