import { GetServerSidePropsResult, Redirect } from "next";
import handleServerSideError from "./handle-server-side-error";

const getServerSidePropsWrapper = async <P>(
  cb: () => Promise<GetServerSidePropsResult<P>>,
  onErrorRedirect?: Redirect
) => {
  try {
    return await cb();
  } catch (error) {
    return handleServerSideError(error, onErrorRedirect);
  }
};

export default getServerSidePropsWrapper;
