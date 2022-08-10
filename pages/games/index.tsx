import { PlusIcon } from "@heroicons/react/solid";
import Link from "next/link";
import Layout from "../../components/layouts/layout";

const GameIndexPage = () => {
  const games = Array.from({ length: 10 });

  return (
    <Layout>
      <main className="container mx-auto mt-8">
        <section className="flex justify-between">
          <h1 className="text-2xl font-bold">My Games</h1>
          <Link href="/games/new">
            <button className="btn btn-primary gap-2">
              <PlusIcon className="h-5 w-5" />
              New Game
            </button>
          </Link>
        </section>

        <section className="grid grid-cols-1 gap-4">
          {games.map((_, idx) => (
            <Link href={`/games/${idx}/edit`} key={idx}>
              <div className="card w-full cursor-pointer bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-24 rounded-xl">
                        <img src="https://placeimg.com/192/192/people" />
                      </div>
                    </div>

                    <h2 className="card-title">Game #{idx + 1}</h2>

                    <div className="flex flex-grow justify-end">
                      <button className="btn btn-error">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default GameIndexPage;
