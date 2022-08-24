import Link from "next/link";
import { useRouter } from "next/router";
import React, { ComponentProps, ComponentType } from "react";
import { AnswerTypes } from "../../../libs/enums";
import Submission from "../../../libs/models/submission";
import SubmissionAnswerData from "../../../libs/models/submission-answer-data";
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
  const gameId = router.query.gameId;

  const answerData =
    typeof submission.answer_data === "string"
      ? (JSON.parse(submission.answer_data) as SubmissionAnswerData)
      : submission.answer_data;

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

        <small>{submission.created_at.toString()}</small>

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
      </section>
    </div>
  );
};

export default SubmissionFeedCard;
