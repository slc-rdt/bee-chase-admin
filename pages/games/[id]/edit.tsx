import { PlusIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import Layout from "../../../components/layouts/layout";
import useFileChooser from "../../../hooks/useFileChooser";

const GameDetail = () => {
  const openFileChooser = useFileChooser();

  const onAddPhoto = async () => {
    const files = await openFileChooser();
    console.log({ files });
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold">Details</h2>

      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 gap-4">
            <section>
              <h3 className="mb-2 font-medium">Photo</h3>

              <div className="flex flex-wrap gap-4">
                <div className="avatar">
                  <div className="h-24 w-24 rounded-xl">
                    <img src="https://placeimg.com/192/192/people" />
                  </div>
                </div>

                <div>
                  <button
                    onClick={onAddPhoto}
                    className="btn btn-primary gap-2"
                  >
                    <PlusIcon className="h-5 w-5" /> Add a photo
                  </button>

                  <p className="mt-2 w-full max-w-xs">
                    Add a photo to set your Experience apart and help
                    participants find it!
                  </p>
                </div>
              </div>
            </section>

            <section className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input type="text" className="input input-bordered w-full" />
              <label className="label">
                <span className="label-text-alt">
                  Every Experience is unique. Give yours a name participants can
                  find (and remember)!
                </span>
              </label>
            </section>

            <section className="form-control w-full">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea className="textarea textarea-bordered h-24"></textarea>
              <label className="label">
                <span className="label-text-alt">
                  Use this space to describe and build excitement for your
                  Experience. You can add information on rules or prizes here,
                  too.
                </span>
              </label>
            </section>

            <section className="form-control w-full">
              <label className="label">
                <span className="label-text">Password (Optional)</span>
              </label>
              <input type="text" className="input input-bordered w-full" />
              <label className="label">
                <span className="label-text-alt">
                  Don't forget to share it with your participants!
                </span>
              </label>
            </section>
          </div>

          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GameDetail;
