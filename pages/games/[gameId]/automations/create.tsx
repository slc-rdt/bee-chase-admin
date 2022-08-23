import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import AutomationForm from "../../../../components/automation/automation-form";
import useService from "../../../../libs/hooks/common/use-service";
import Automation from "../../../../libs/models/automation";
import Mission from "../../../../libs/models/mission";
import AutomationService from "../../../../libs/services/automation-service";
import MissionService from "../../../../libs/services/mission-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  { missions: Mission[] },
  { gameId: string }
> = async (context) => {
  try {
    const gameId = context.params?.gameId ?? "";

    const missionService = await createServerSideService(
      context.req,
      MissionService
    );

    const missions = await missionService.getAll(gameId);

    return {
      props: {
        missions,
      },
    };
  } catch (error) {
    return handleServerSideError(error);
  }
};

const CreateAutomationPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ missions }) => {
  const router = useRouter();
  const automationService = useService(AutomationService);

  const onAutomationFormSubmit = async (data: Automation) => {
    const gameId = `${router.query.gameId ?? ""}`;

    await toast.promise(automationService.create(gameId, data), {
      loading: "Creating automation...",
      success: "Automation created!",
      error: "Failed to create automation.",
    });

    router.push(`/games/${gameId}/automations`);
  };

  return (
    <div className="mx-auto max-w-screen-md">
      <AutomationForm {...{ missions, onAutomationFormSubmit }} />
    </div>
  );
};

export default CreateAutomationPage;
