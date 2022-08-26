import { TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType } from "react";
import PaginateResponseDto from "../../../libs/dtos/paginate-response-dto";
import useLoading from "../../../libs/hooks/common/use-loading";
import useOneDriveImage from "../../../libs/hooks/common/use-one-drive-image";
import Submission from "../../../libs/models/submission";
import SubmissionAnswerData from "../../../libs/models/submission-answer-data";
import Pagination from "../../common/pagination";

interface ISubmissionsViewByMissionTextType {
  currentPage: number;
  submissionsPaginated: PaginateResponseDto<Submission>;
  onDelete: (submission: Submission) => Promise<void>;
}

const SubmissionsViewByMissionImageType: ComponentType<
  ComponentProps<"div"> & ISubmissionsViewByMissionTextType
> = ({ currentPage, submissionsPaginated, onDelete }) => {
  return (
    <Pagination
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      currentPage={currentPage}
      pagination={submissionsPaginated}
      render={(submission) => (
        <ImageSubmissionItem
          key={submission.id}
          submission={submission}
          onDelete={onDelete}
        />
      )}
    />
  );
};

interface IImageSubmissionItem {
  submission: Submission;
  onDelete: (submission: Submission) => Promise<void>;
}

const ImageSubmissionItem: ComponentType<
  ComponentProps<"div"> & IImageSubmissionItem
> = ({ submission, onDelete, ...rest }) => {
  const router = useRouter();
  const { isLoading, doAction } = useLoading();

  const gameId = router.query.gameId ?? "";

  const answerData =
    typeof submission.answer_data === "string"
      ? (JSON.parse(submission.answer_data) as SubmissionAnswerData)
      : submission.answer_data;

  const { data } = useOneDriveImage(answerData.download_url);

  const onDeleteClicked = (submission: Submission) => {
    doAction(onDelete(submission));
  };

  return (
    <div
      key={submission.id}
      className={`card bg-base-100 shadow-xl ${isLoading && "animate-pulse"}`}
      {...rest}
    >
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data} alt="submission image" />
      </figure>

      <div className="card-body">
        <Link
          href={`/games/${gameId}/submissions/team/${submission.game_team_id}`}
        >
          <a className="link card-title link-primary">
            {submission.game_team?.name}
          </a>
        </Link>

        <p>
          <span className="badge badge-primary">
            {submission.mission?.point_value} PTS
          </span>
        </p>

        <div className="card-actions justify-end">
          <button
            onClick={() => onDeleteClicked(submission)}
            disabled={isLoading}
            className={`btn btn-error gap-2 ${isLoading && "loading"}`}
          >
            {!isLoading && <TrashIcon className="h-5 w-5" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsViewByMissionImageType;
