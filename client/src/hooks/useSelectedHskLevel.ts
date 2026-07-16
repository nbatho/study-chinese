import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setHskSelection } from "../store/modules/appSlice";
import { getCurriculumLevel, getRecommendedHsk } from "../pages/Learn/curriculum";
import type { CefrLevel } from "../api/users";

/**
 * The HSK level the roadmap is currently showing: the learner's manual pick from
 * the Learn screen, or the level recommended by their CEFR level.
 *
 * Learn and Navbar both render progress for this level, so they resolve it here
 * rather than each deriving it from the profile on their own.
 *
 * @param cefrLevel   The learner's CEFR level, from their profile.
 * @param placementAt When they last completed the placement test. A manual pick
 *                    is dropped once this changes, since a new placement means a
 *                    new recommendation.
 */
export const useSelectedHskLevel = (cefrLevel: CefrLevel, placementAt: string | null, foundationComplete = true) => {
  const dispatch = useAppDispatch();
  const selection = useAppSelector((state) => state.app.hskSelection);

  const recommendedHsk = useMemo(() => {
    if (!foundationComplete) return 0;
    return getRecommendedHsk(cefrLevel);
  }, [cefrLevel, foundationComplete]);
  const selectedHsk = selection?.placementAt === placementAt ? selection.level : recommendedHsk;

  const selectHskLevel = useCallback(
    (level: number) => {
      dispatch(setHskSelection({ placementAt, level }));
    },
    [dispatch, placementAt],
  );

  return {
    selectedHsk,
    recommendedHsk,
    selectedCurriculum: useMemo(() => getCurriculumLevel(selectedHsk), [selectedHsk]),
    selectHskLevel,
  };
};
