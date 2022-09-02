import React, { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import Game from "../../libs/models/game";

interface IGameAccessCodeButton {
  game: Game;
}

const GameAccessCodeButton: ComponentType<
  ComponentProps<"button"> & IGameAccessCodeButton
> = ({ game, className, ...rest }) => {
  const onGameCodeClick = async () => {
    try {
      await navigator.clipboard.writeText(game.access_code);
      toast.success("Code copied to clipboard!");
    } catch (error) {
      toast.success("Failed to copy code to clipboard.");
      console.error(error);
    }
  };

  return (
    <div
      className="tooltip tooltip-secondary"
      data-tip="Game access code. Click to copy."
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onGameCodeClick();
        }}
        className={`btn btn-secondary ${className}`}
        {...rest}
      >
        {game.access_code}
      </button>
    </div>
  );
};

export default GameAccessCodeButton;
