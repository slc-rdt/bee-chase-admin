import { PlusIcon } from "@heroicons/react/solid";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../../components/layouts/layout";

export const getServerSideProps: GetServerSideProps<
  {},
  { id: string }
> = async (context) => {
  return {
    props: {},
  };
};

const MissionsPage = () => {
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

      <section className="rounded-box mt-4 overflow-x-auto shadow-xl">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </section>
    </Layout>
  );
};

export default MissionsPage;
