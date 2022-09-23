import { DateTime } from "luxon";
import {
  ComponentProps,
  ComponentType,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useForm, UseFormWatch } from "react-hook-form";
import useDebounce from "../../libs/hooks/common/use-debouce";
import Tag from "../../libs/models/tag";
import { IGlobalLeaderboardFilterFormValues } from "../../pages/global-leaderboard";

interface IGlobalLeaderboardFilterForm {
  tags: Tag[];
  defaultStartDate: string;
  defaultEndDate: string;
  setTag: Dispatch<SetStateAction<Tag | undefined>>;
  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;
}

const GlobalLeaderboardFilterForm: ComponentType<
  ComponentProps<"section"> & IGlobalLeaderboardFilterForm
> = ({
  tags,
  defaultStartDate,
  defaultEndDate,
  setTag,
  setStartDate,
  setEndDate,
}) => {
  const minDateTime = DateTime.fromISO(defaultStartDate);
  const maxDateTime = DateTime.fromISO(defaultEndDate);

  const defaultValues = {
    tagId: tags[0]?.id,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  };

  const { register, watch } = useForm<IGlobalLeaderboardFilterFormValues>({
    defaultValues,
  });

  useWatchTag(watch, tags, setTag);

  useWatchDateRange(watch, minDateTime, maxDateTime, setStartDate, setEndDate);

  return (
    <section>
      <section className="form-control mb-4 w-full">
        <label className="label">
          <span className="label-text">Leaderboard Tag</span>
        </label>
        <select {...register("tagId")} className="select select-bordered">
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <label className="label">
          <span className="label-text-alt">
            Choose a tag to filter the leaderboard.
          </span>
        </label>
      </section>

      <section className="flex flex-wrap gap-4">
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">From</span>
          </label>
          <input
            {...register("startDate")}
            type="datetime-local"
            className="peer input input-bordered invalid:input-error"
            min={defaultValues.startDate}
            max={defaultValues.endDate}
          />
          <label className="label hidden peer-invalid:block">
            <span className="label-text-alt text-error">
              Start date must be between{" "}
              {defaultValues.startDate.replace("T", " ")} and{" "}
              {defaultValues.endDate.replace("T", " ")}.
            </span>
          </label>
          <label className="label hidden peer-valid:block">
            <span className="label-text-alt">
              Choose start date to filter the leaderboard.
            </span>
          </label>
        </div>

        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">To</span>
          </label>
          <input
            {...register("endDate")}
            type="datetime-local"
            className="peer input input-bordered invalid:input-error"
            min={defaultValues.startDate}
            max={defaultValues.endDate}
          />
          <label className="label hidden peer-invalid:block">
            <span className="label-text-alt text-error">
              End date must be between{" "}
              {defaultValues.startDate.replace("T", " ")} and{" "}
              {defaultValues.endDate.replace("T", " ")}.
            </span>
          </label>
          <label className="label hidden peer-valid:block">
            <span className="label-text-alt">
              Choose end date to filter the leaderboard.
            </span>
          </label>
        </div>
      </section>
    </section>
  );
};

function useWatchTag(
  watch: UseFormWatch<IGlobalLeaderboardFilterFormValues>,
  tags: Tag[],
  setTag: Dispatch<SetStateAction<Tag | undefined>>
) {
  const tagId = watch("tagId");

  useEffect(() => {
    const tag = tags.find((tag) => tag.id === tagId);
    setTag(tag);
  }, [setTag, tagId, tags]);
}

function useWatchDateRange(
  watch: UseFormWatch<IGlobalLeaderboardFilterFormValues>,
  minDateTime: DateTime,
  maxDateTime: DateTime,
  setStartDate: Dispatch<SetStateAction<string>>,
  setEndDate: Dispatch<SetStateAction<string>>
) {
  const debounce = useDebounce();

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      debounce(() => {
        const { startDate, endDate } = value;

        if (startDate) {
          const it = DateTime.fromISO(startDate);
          if (minDateTime > it) return;
          if (maxDateTime < it) return;
          setStartDate(startDate);
        }

        if (endDate) {
          const it = DateTime.fromISO(endDate);
          if (minDateTime > it) return;
          if (maxDateTime < it) return;
          setEndDate(endDate);
        }
      });
    });
    return () => unsubscribe();
  }, [debounce, maxDateTime, minDateTime, setEndDate, setStartDate, watch]);
}

export default GlobalLeaderboardFilterForm;
