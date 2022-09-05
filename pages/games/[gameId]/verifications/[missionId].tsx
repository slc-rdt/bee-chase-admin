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
import { useRouter } from "next/router";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
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
  const duration = Number(context.query.duration ?? 7);

  try {
    const missionService = await createServerSideService(
      context.req,
      MissionService
    );

    const missionCode = await missionService.getVerificationCode(
      gameId,
      missionId,
      { duration }
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
  const [qrCodeImgUrl, setQrCodeImgUrl] = useState("");
  const [qrCodeSize, setQrCodeSize] = useState(512);

  useEffect(() => {
    const durationInMilliSeconds = duration * 1000;

    const intervalId = setInterval(() => {
      router.push(router.asPath);
    }, durationInMilliSeconds);

    return () => clearInterval(intervalId);
  }, [duration, router]);

  useEffect(() => {
    (async () => {
      try {
        const url = await QRCode.toDataURL(missionCode.code);
        setQrCodeImgUrl(url);
      } catch (error) {
        const err = error as Error;
        console.error(err);
        toast.error(
          `An error occurred when generating QRCode (${err.message}).`
        );
      }
    })();
  }, [missionCode.code]);

  return (
    <>
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

      <section>
        <h2 className="text-center font-mono text-9xl font-bold uppercase">
          {missionCode.code}
        </h2>
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

export default VerificationDetailPage;
