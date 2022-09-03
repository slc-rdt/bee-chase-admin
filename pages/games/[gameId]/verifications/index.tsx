import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import Pagination from "../../../../components/common/pagination";
import MissionCard from "../../../../components/mission/card/mission-card";
import PaginateResponseDto from "../../../../libs/dtos/paginate-response-dto";
import { AnswerTypes } from "../../../../libs/enums";
import Mission from "../../../../libs/models/mission";
import MissionService from "../../../../libs/services/mission-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  {
    page: number;
    gameId: string;
    missionsPaginated: PaginateResponseDto<Mission>;
  },
  { gameId: string }
> = async (context) => {
  try {
    const page = Number(context.query.page ?? 1);
    const gameId = context.params?.gameId ?? "";

    const missionService = await createServerSideService(
      context.req,
      MissionService
    );

    const missionsPaginated = await missionService.getAllPaginated(gameId, {
      page,
      answer_type: AnswerTypes.VERIFICATION.toString(),
    });

    return { props: { page, gameId, missionsPaginated } };
  } catch (error) {
    return handleServerSideError(error, {
      destination: "/games",
      permanent: false,
    });
  }
};

const VerificationsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ page, gameId, missionsPaginated }) => {
  return (
    <div className="mx-auto max-w-screen-md">
      <header>
        <h2 className="mb-4 text-3xl font-bold">Verifications</h2>
      </header>

      <Pagination
        currentPage={page}
        pagination={missionsPaginated}
        render={(mission) => (
          <Link
            key={mission.id}
            href={`/games/${gameId}/verifications/${mission.id}`}
          >
            <a>
              <MissionCard mission={mission} />
            </a>
          </Link>
        )}
      />
    </div>
  );
};

export default VerificationsPage;
