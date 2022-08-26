import { TrashIcon } from "@heroicons/react/20/solid";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  ComponentProps,
  ComponentType,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { AnswerTypes } from "../../../libs/enums";
import useLoading from "../../../libs/hooks/common/use-loading";
import useService from "../../../libs/hooks/common/use-service";
import Submission from "../../../libs/models/submission";
import SubmissionAnswerData from "../../../libs/models/submission-answer-data";
import SubmissionService from "../../../libs/services/submission-service";
import convertTimeServerToLocal from "../../../libs/utils/convert-time-server-to-local";
import parseJsonIfString from "../../../libs/utils/parse-json-if-string";
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
        <h2 className="card-title">
          <Link
            href={`/games/${gameId}/submission/teams/${submission.game_team_id}`}
          >
            <a className="link link-primary font-bold">
              {submission.game_team?.name}
            </a>
          </Link>
          completed{" "}
          <span className="font-bold">{submission.mission?.name}</span> for{" "}
          {submission.mission?.point_value} points
        </h2>

        <small>{when}</small>

        <p>{submission.caption}</p>

        {Number(submission.mission?.answer_type) === AnswerTypes.GPS && (
          <SubmissionFeedCardGpsContent {...{ submission, answerData }} />
        )}
        {Number(submission.mission?.answer_type) === AnswerTypes.IMAGE && (
          <SubmissionFeedCardImageContent {...{ submission, answerData }} />
        )}
        {Number(submission.mission?.answer_type) === AnswerTypes.TEXT && (
          <SubmissionFeedCardTextContent {...{ submission, answerData }} />
        )}

        <section className="card-actions justify-end">
          <button
            onClick={onDelete}
            className={`btn btn-error gap-2 ${isLoading && "loading"}`}
            disabled={isLoading}
          >
            {!isLoading && <TrashIcon className="h-5 w-5" />}
            Delete
          </button>
        </section>
      </section>
    </div>
  );
};

export default SubmissionFeedCard;
