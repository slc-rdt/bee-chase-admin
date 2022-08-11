import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/solid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../../components/layouts/layout";
import LoginDto from "../../../../libs/dtos/login-dto";
import PaginateResponseDto from "../../../../libs/dtos/paginate-response-dto";
import Mission from "../../../../libs/models/mission";
import MissionService from "../../../../libs/services/mission-service";
import { authOptions } from "../../../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<
  { paginatedMissions?: PaginateResponseDto<Mission> },
  { gameId: string }
> = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session?.user) {
    return {
      props: {},
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const user = session.user as LoginDto;
  const missionService = new MissionService(user.access_token);

  const gameId = context.params?.gameId ?? "";
  const page = 1;

  const paginatedMissions = await missionService.getAllPaginated(gameId, {
    page,
  });
  console.log(paginatedMissions);
  return {
    props: {
      paginatedMissions,
    },
  };
};

const MissionsPage = ({
  paginatedMissions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <Layout>
      <section className="flex flex-wrap justify-between">
        <h2 className="mb-2 text-3xl font-bold">Mission</h2>
        <Link href={`/games/${router.query.gameId}/missions/create`}>
          <button className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Add Mission
          </button>
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-4">
        {paginatedMissions?.data.length === 0 && (
          <h2 className="font-lg text-center font-medium">No missions yet.</h2>
        )}

        {paginatedMissions?.data.map((mission) => (
          <div key={mission.id} className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title capitalize">{mission.name}</h2>
              <p>{mission.description}</p>

              <div className="card-actions justify-end">
                <button className="btn btn-secondary gap-2">
                  <PencilIcon className="h-5 w-5" /> Edit
                </button>
                <button className="btn btn-error gap-2">
                  <TrashIcon className="h-5 w-5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </Layout>
  );
};

export default MissionsPage;
