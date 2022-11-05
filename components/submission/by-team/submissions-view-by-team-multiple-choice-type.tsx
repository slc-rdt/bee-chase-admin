import { TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import useLoading from "../../../libs/hooks/common/use-loading";
import Submission from "../../../libs/models/submission";
import parseJsonIfString from "../../../libs/utils/parse-json-if-string";
import ConfirmationModal from "../../common/confirmation-modal";
import PaginationButtons from "../../common/pagination-buttons";

interface ISubmissionsViewByTeamMultipleChoiceType {
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
  onDelete: (submission: Submission) => Promise<void>;
}

const SubmissionsViewByTeamMultipleChoiceType: ComponentType<
  ComponentProps<"div"> & ISubmissionsViewByTeamMultipleChoiceType
> = ({ currentPage, submissionsPaginated, onDelete }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Mission</th>
              <th>Answers</th>
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
              <MultipleChoiceSubmissionItem
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

interface IMultipleChoiceSubmissionItem {
  submission: Submission;
  onDelete: (submission: Submission) => Promise<void>;
}

const MultipleChoiceSubmissionItem: ComponentType<
  ComponentProps<"tr"> & IMultipleChoiceSubmissionItem
> = ({ submission, onDelete, ...rest }) => {
  const router = useRouter();
  const { isLoading, doAction } = useLoading();

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
          href={`/games/${gameId}/submissions/mission/${submission.mission_id}`}
        >
          <a className="whitespace-pre-wrap">{submission.mission?.name}</a>
        </Link>
      </th>

      <td>
        <div className="flex flex-wrap gap-2">
          {parseJsonIfString(submission.answer_data).answers?.map(
            (answer, idx) => (
              <span key={idx} className="badge badge-primary">
                {answer}
              </span>
            )
          )}
        </div>
      </td>
      <td>{submission.is_accepted ? submission.mission?.point_value : 0}</td>
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

export default SubmissionsViewByTeamMultipleChoiceType;
