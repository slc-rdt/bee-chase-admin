import {
  ArrowLeftIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/20/solid";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Image from "next/image";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import QRCode from "qrcode";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import MissionCode from "../../../../libs/models/mission-code";
import MissionService from "../../../../libs/services/mission-service";
import createServerSideService from "../../../../libs/utils/create-server-side-service";
import handleServerSideError from "../../../../libs/utils/handle-server-side-error";

export const getServerSideProps: GetServerSideProps<
  { gameId: string; missionCode: MissionCode; duration: number },
  { gameId: string; missionId: string }
> = async (context) => {
  const gameId = context.params?.gameId ?? "";
  const missionId = context.params?.missionId ?? "";
  const duration = Number(context.query.duration ?? 15);

  try {
    const missionService = await createServerSideService(
      context.req,
      MissionService
    );

    const missionCode = await missionService.getVerificationCode(
      gameId,
      missionId,
      { duration, withMission: true }
    );

    return { props: { gameId, missionCode, duration } };
  } catch (error) {
    return handleServerSideError(error, {
      destination: `/games/${gameId}/verifications`,
      permanent: false,
    });
  }
};

const VerificationDetailPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ gameId, missionCode, duration }) => {
  const qrCodeSizeMultiplier = 32;

  const router = useRouter();
  const countdownRef = useRef<HTMLSpanElement | null>(null);
  const [qrCodeImgUrl, setQrCodeImgUrl] = useState("");
  const [qrCodeSize, setQrCodeSize] = useState(512);
  const [remainingSeconds, setRemainingSeconds] = useState(duration);

  useRefreshQrCodeEffect(duration, router, setRemainingSeconds);

  useCountdownEffect(setRemainingSeconds);

  useGenerateQrCodeEffect(missionCode.code, setQrCodeImgUrl);

  return (
    <>
      <section className="mb-4">
        <h2 className="text-center text-xl font-bold">
          {missionCode.mission?.name}
        </h2>
      </section>

      <section className="mx-auto mb-4 max-w-screen-md">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setQrCodeSize(qrCodeSize - qrCodeSizeMultiplier)}
            className="btn btn-primary gap-2"
          >
            <MagnifyingGlassMinusIcon className="h-5 w-5" />
            Zoom Out
          </button>
          <button
            onClick={() => setQrCodeSize(qrCodeSize + qrCodeSizeMultiplier)}
            className="btn btn-primary gap-4"
          >
            <MagnifyingGlassPlusIcon className="h-5 w-5" />
            Zoom In
          </button>
        </div>
      </section>

      <section className="text-center font-bold">
        <h2 className="font-mono text-9xl uppercase">
          <small>{missionCode.code}</small>
        </h2>

        <small className="text-xl">
          Refresh in{" "}
          <span className="countdown">
            {/* @ts-ignore '--value' is required for DaisyUI */}
            <span ref={countdownRef} style={{ "--value": remainingSeconds }} />
          </span>{" "}
          seconds.
        </small>
      </section>

      <section className="grid place-items-center">
        {qrCodeImgUrl && (
          <Image
            src={qrCodeImgUrl}
            height={qrCodeSize}
            width={qrCodeSize}
            alt="qr code"
          />
        )}
      </section>

      <section className="grid place-items-center">
        <Link href={`/games/${gameId}/verifications`}>
          <a className="btn btn-primary gap-2">
            <ArrowLeftIcon className="h-5 w-5" />
            Done
          </a>
        </Link>
      </section>
    </>
  );
};

const useRefreshQrCodeEffect = (
  duration: number,
  router: NextRouter,
  setRemainingSeconds: Dispatch<SetStateAction<number>>
) => {
  useEffect(() => {
    const durationInMilliSeconds = duration * 1000;

    const id = setTimeout(async () => {
      await router.push(router.asPath);
      setRemainingSeconds(duration);
    }, durationInMilliSeconds);

    return () => clearTimeout(id);
  }, [duration, router, setRemainingSeconds]);
};

const useCountdownEffect = (
  setRemainingSeconds: Dispatch<SetStateAction<number>>
) => {
  useEffect(() => {
    const id = setInterval(
      () => setRemainingSeconds((x) => Math.max(x - 1, 0)),
      1000
    );
    return () => clearInterval(id);
  }, [setRemainingSeconds]);
};

const useGenerateQrCodeEffect = (
  code: string,
  setQrCodeImgUrl: Dispatch<SetStateAction<string>>
) => {
  useEffect(() => {
    (async () => {
      try {
        const url = await QRCode.toDataURL(code);
        setQrCodeImgUrl(url);
      } catch (error) {
        const err = error as Error;
        console.error(err);
        toast.error(
          `An error occurred when generating QRCode (${err.message}).`
        );
      }
    })();
  }, [code, setQrCodeImgUrl]);
};

export default VerificationDetailPage;
