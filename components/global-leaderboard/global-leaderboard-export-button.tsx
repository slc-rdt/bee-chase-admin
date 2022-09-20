import { ArrowDownOnSquareIcon } from "@heroicons/react/20/solid";
import { ComponentProps, ComponentType } from "react";
import toast from "react-hot-toast";
import useDownloadBlob from "../../libs/hooks/common/use-download-blob";
import useLoading from "../../libs/hooks/common/use-loading";
import useService from "../../libs/hooks/common/use-service";
import Tag from "../../libs/models/tag";
import TagService from "../../libs/services/tag-service";

interface IGlobalLeaderboardExportButton {
  tag?: Tag;
}

const GlobalLeaderboardExportButton: ComponentType<
  ComponentProps<"button"> & IGlobalLeaderboardExportButton
> = ({ tag }) => {
  const tagService = useService(TagService);
  const downloadBlob = useDownloadBlob();
  const { isLoading, doAction } = useLoading();

  const onExport = async () => {
    if (!tag) {
      toast.error("Please select a tag first.");
      return;
    }

    const exported = await doAction(tagService.exportGlobalLeaderboard(tag));
    downloadBlob(...exported);
  };

  return (
    <button
      onClick={onExport}
      disabled={isLoading}
      className={`btn btn-secondary gap-2 ${isLoading && "loading"}`}
    >
      {!isLoading && <ArrowDownOnSquareIcon className="h-5 w-5" />}
      Export global leaderboard
    </button>
  );
};

export default GlobalLeaderboardExportButton;
