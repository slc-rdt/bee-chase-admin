import QRCode from "qrcode";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import useService from "../../../../libs/hooks/common/use-service";
import MissionService from "../../../../libs/services/mission-service";
import { NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {};

const VerificationDetailPage: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const missionService = useService(MissionService);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     (async () => {
  //       missionService.getVerificationCode(gameId, missionId)
  //     })();
  //   }
  // }, []);

  return (
    <div className="mx-auto h-full max-w-screen-lg">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default VerificationDetailPage;
