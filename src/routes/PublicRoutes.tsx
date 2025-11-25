import TestSlider from "@/components/TestSlider";
import { AssessmentHistoryProvider } from "@/context/assessmentV2/Assessment.provider";

import HomeV2 from "@/pages/public/homeV2/Home";
import AssessmentHistoryPage from "@/pages/public/AssessmentHistoryPage";
import { Route, Routes } from "react-router-dom";
import SpeakingPracticePage from "@/pages/public/AssesmentPractice/AssessmentPracticePage";
import TaskListPage from "@/pages/public/TaskList/TaskListPage";
// import WritingPracticePage from "@/pages/public/WritingPracticePage";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import HomeV3 from "@/pages/public/homeV3/Home";

export default function PublicRoutes() {
  return (
    <AssessmentHistoryProvider>
      <Routes>
        <Route index element={<HomeV2 />} />
        <Route path="test/:testTypeSlug" element={<TaskListPage />} />
        <Route
          path="test/:testType/:taskTypeUUID/:action?"
          element={<SpeakingPracticePage />}
        />

        {/* <Route path="writing" element={<WritingPracticePage />} /> */}

        <Route path="/test-history" element={<AssessmentHistoryPage />} />
        <Route path="/sa" element={<TestSlider questions={[]} />} />

        <Route path="v3" element={<HomeV3 />} />
      </Routes>
    </AssessmentHistoryProvider>
  );
}
