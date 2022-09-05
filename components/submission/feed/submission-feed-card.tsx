import { TrashIcon } from "@heroicons/react/20/solid";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ComponentType, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AnswerTypes } from "../../../libs/enums";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Submission from "../../../libs/models/submission";
import SubmissionService from "../../../libs/services/submission-service";
import parseJsonIfString from "../../../libs/utils/parse-json-if-string";
import ConfirmationModal from "../../common/confirmation-modal";
import SubmissionFeedCardGpsContent from "./submission-feed-card-gps-content";
import SubmissionFeedCardImageContent from "./submission-feed-card-image-content";
import SubmissionFeedCardTextContent from "./submission-feed-card-text-content";

interface ISubmissionFeedCard {
  submission: Submission;
}

const SubmissionFeedCard: ComponentType<
  ComponentProps<"div"> & ISubmissionFeedCard
> = ({ submission, ...rest }) => {
  const router = useRouter();
  const submissionService = useService(SubmissionService);
  const { isLoading, doAction } = useLoading();
  const [when, setWhen] = useState("");

  const gameId = router.query.gameId;

  const answerType = Number(submission.mission?.answer_type);
  const answerData = parseJsonIfString(submission.answer_data);

  const onDelete = async () => {
    await toast.promise(doAction(submissionService.delete(submission)), {
      loading: "Deleting submission...",
      success: "Submission deleted!",
      error: "Failed to delete submission.",
    });

    router.push(router.asPath);
  };

  useEffect(() => {
    const originalDateTime = submission.created_at.toString();
    const humanFriendlyDateTime = DateTime.fromISO(originalDateTime)
      .toUTC()
      .toLocal()
      .toRelative();
    setWhen(humanFriendlyDateTime ?? originalDateTime);
  }, [submission.created_at]);

  return (
    <div className="card card-side shadow-xl" {...rest}>
      <section className="ml-6 mt-10">
        <div
          className="h-10 w-10 rounded-full border"
          style={{ backgroundColor: submission.game_team?.color }}
        />
      </section>

      <section className="card-body">
        <header className="card-title">
          <h2>
            <Link
              href={`/games/${gameId}/submissions/team/${submission.game_team_id}`}
            >
              <a className="link link-primary font-bold">
                {submission.game_team?.name}
              </a>
            </Link>{" "}
            completed{" "}
            <span className="font-bold">{submission.mission?.name}</span> for{" "}
            {submission.mission?.point_value} points
          </h2>
        </header>

        <small>
          {when} <br />
          {submission.user && (
            <>
              Submitted by:{" "}
              <span className="font-bold">
                {submission.user.username} - {submission.user.name}
              </span>
            </>
          )}
        </small>

        <p>{submission.caption}</p>

        {answerType === AnswerTypes.GPS && (
          <SubmissionFeedCardGpsContent {...{ submission, answerData }} />
        )}

        {answerType === AnswerTypes.IMAGE && (
          <SubmissionFeedCardImageContent {...{ submission, answerData }} />
        )}

        {answerType === AnswerTypes.TEXT && (
          <SubmissionFeedCardTextContent {...{ submission, answerData }} />
        )}

        <section className="card-actions justify-end">
          <ConfirmationModal
            className="btn btn-error gap-2"
            modalKey={submission.id}
            isLoading={isLoading}
            onConfirm={onDelete}
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </ConfirmationModal>
        </section>
      </section>
    </div>
  );
};

export default SubmissionFeedCard;
