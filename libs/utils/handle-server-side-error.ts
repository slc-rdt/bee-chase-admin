import { AxiosError } from "axios";
import { GetServerSidePropsResult, Redirect } from "next";
import { redirectToLogin } from "../constants";

export default function handleServerSideError(
  error: unknown | AxiosError,
  onErrorRedirect?: Redirect
): GetServerSidePropsResult<any> {
  let message = "";
  let responseStatusCode = -1;

  if (!error || !(error instanceof Error)) {
    message = "Unknown error occurred.";
  } else if (error instanceof AxiosError) {
    message = error.response?.data?.message ?? error.message;
    responseStatusCode = error.response?.status ?? -1;
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.error(error);

  const unauthorized = 401;
  if (onErrorRedirect && responseStatusCode !== unauthorized) {
    return {
      props: {},
      redirect: onErrorRedirect,
    };
  }

  return redirectToLogin;
}
