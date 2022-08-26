import { PlusIcon } from "@heroicons/react/20/solid";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import React from "react";
import AutomationCard from "../../../../components/automation/automation-card";
import Pagination from "../../../../components/common/pagination";
import PaginateResponseDto from "../../../../libs/dtos/paginate-response-dto";
import Automation from "../../../../libs/models/automation";
import AutomationService from "../../../../libs/services/automation-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  {
    gameId: string;
    page: number;
    automationsPaginated: PaginateResponseDto<Automation>;
  },
  { gameId: string }
> = async (context) => {
  try {
    const automationService = await createServerSideService(
      context.req,
      AutomationService
    );

    const gameId = context.params?.gameId ?? "";
    const page = Number(context.query.page ?? 1);
    const automationsPaginated = await automationService.getAllPaginated(
      gameId,
      { page }
    );

    return {
      props: {
        gameId,
        page,
        automationsPaginated,
      },
    };
  } catch (error) {
    return handleServerSideError(error);
  }
};

const AutomationsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameId, page, automationsPaginated }) => {
  return (
    <div className="mx-auto max-w-screen-lg">
      <header className="flex flex-wrap items-center justify-between">
        <h2 className="mb-4 text-3xl font-bold">Automations</h2>

        <Link href={`/games/${gameId}/automations/create`}>
          <a className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Automation
          </a>
        </Link>
      </header>

      <section>
        <Pagination
          currentPage={page}
          pagination={automationsPaginated}
          render={(automation) => (
            <AutomationCard key={automation.id} automation={automation} />
          )}
        />
      </section>
    </div>
  );
};

export default AutomationsPage;
