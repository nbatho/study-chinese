import HeroCard from "./component/HeroCard";
import ContinueLearningCard from "./component/ContinueLearningCard";
import TodayPlanCard from "./component/TodayPlanCard";
import WeakSpotsCard from "./component/WeakSpotsCard";
import DailyPhraseCard from "./component/DailyPhraseCard";
import GoalsWalletCard from "./component/GoalsWalletCard";
import LeaderboardCard from "./component/LeaderboardCard";
import DailyChallengesCard from "./component/DailyChallengesCard";
import BadgesCard from "./component/BadgesCard";

export default function Home() {
  return (
    <div className="app-page">
      <div className="grid min-w-0 gap-5 lg:grid-cols-12">
        <div className="grid min-w-0 gap-5 lg:col-span-8">
          <HeroCard />
          <ContinueLearningCard />
          <TodayPlanCard />
          <WeakSpotsCard />
          <DailyPhraseCard />
        </div>

        <aside className="grid min-w-0 content-start gap-5 lg:col-span-4">
          <GoalsWalletCard />
          <LeaderboardCard />
          <DailyChallengesCard />
          <BadgesCard />
        </aside>
      </div>
    </div>
  );
}
