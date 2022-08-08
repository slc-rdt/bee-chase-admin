import { NextPage } from "next";
import Image from "next/image";
import { FormEventHandler } from "react";
import BinusImg from "../public/binus.png";
import RibbonImg from "../public/ribbon.png";

const Login: NextPage = () => {
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = Array.from(new FormData(e.currentTarget).entries());
    console.log(formData);
  };

  return (
    <main className="h-screen grid place-items-center">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="px-10 flex items-center gap-2">
          <Image src={RibbonImg} alt="ribbon" className="mr-2" />
          <Image src={BinusImg} alt="binus" />
        </div>

        <form
          className="card-body items-center text-center"
          onSubmit={onSubmit}
        >
          <input
            type="text"
            name="nim"
            placeholder="NIM"
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs"
          />

          <div className="card-actions w-full">
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
