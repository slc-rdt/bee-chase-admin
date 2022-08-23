import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import AutomationForm from "../../../../../components/automation/automation-form";
import useService from "../../../../../libs/hooks/common/use-service";
import Automation from "../../../../../libs/models/automation";
import Mission from "../../../../../libs/models/mission";
import AutomationService from "../../../../../libs/services/automation-service";
import MissionService from "../../../../../libs/services/mission-service";
import createServerSideService from "../../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  { automation: Automation; missions: Mission[] },
  { gameId: string; automationId: string }
> = async (context) => {
  try {
    const gameId = context.params?.gameId ?? "";
    const automationId = context.params?.automationId ?? "";

    const [automationService, missionService] = await Promise.all([
      createServerSideService(context.req, AutomationService),
      createServerSideService(context.req, MissionService),
    ]);

    const [automation, missions] = await Promise.all([
      automationService.getOneById(gameId, automationId),
      missionService.getAll(gameId),
    ]);

    return {
      props: {
        automation,
        missions,
      },
    };
  } catch (error) {
    return handleServerSideError(error, {
      destination: "/games",
      permanent: false,
    });
  }
};

const EditAutomationPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ automation, missions }) => {
  const router = useRouter();
  const automationService = useService(AutomationService);

  const onAutomationFormSubmit = async (data: Automation) => {
    await toast.promise(automationService.update(data), {
      loading: "Updating automation...",
      success: "Automation updated!",
      error: "Failed to update automation",
    });

    const gameId = router.query.gameId;
    router.push(`/games/${gameId}/automations`);
  };

  return (
    <>
      <h2 className="mb-4 text-3xl font-bold"></h2>
      <AutomationForm {...{ automation, missions, onAutomationFormSubmit }} />
    </>
  );
};

export default EditAutomationPage;
