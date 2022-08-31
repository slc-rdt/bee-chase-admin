import type { NextApiRequest, NextApiResponse } from "next";
import Game from "../../../libs/models/game";
import MissionData from "../../../libs/models/mission-data";
import GameService from "../../../libs/services/game-service";
import MissionService from "../../../libs/services/mission-service";
import createServerSideService from "../../../libs/utils/create-server-side-service";
import parseJsonIfString from "../../../libs/utils/parse-json-if-string";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  const gameId = req.body.gameId;

  const [gameService, missionService] = await Promise.all([
    createServerSideService(req, GameService),
    createServerSideService(req, MissionService),
  ]);

  const [game, missions] = await Promise.all([
    gameService.getOneById(gameId),
    missionService.getAll(gameId),
  ]);

  const clonedGame = await gameService.create({ ...game });
  await Promise.all(
    missions.map((mission) =>
      missionService.create(clonedGame.id, {
        ...mission,
        mission_data: parseJsonIfString<MissionData>(mission.mission_data),
      })
    )
  );

  console.log(clonedGame);

  res.status(200).json(clonedGame);
}
