import TestSlider from "@/components/TestSlider";

import SpeakingPracticePage from "@/pages/public/AssesmentPractice/AssessmentPracticePage";
import AssessmentHistoryPage from "@/pages/public/AssessmentHistoryPage";
import TaskListPage from "@/pages/public/TaskList/TaskListPage";
import { Route, Routes } from "react-router-dom";
// import WritingPracticePage from "@/pages/public/WritingPracticePage";

import { AuthProvider } from "@/comman/contexts/AuthContext";
import { EvaluationProvider } from "@/context/assessmentV3/Evaluation.provider";
import HomeV3 from "@/pages/public/homeV3/Home";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PublicRoutes() {
  return (
    <EvaluationProvider>
      <AuthProvider>
        <Routes>
          <Route index element={<HomeV3 />} />
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
      </AuthProvider>
    </EvaluationProvider>
  );
}
