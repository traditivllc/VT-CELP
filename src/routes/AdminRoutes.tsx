import PromptQuestionsAdmin from "@/pages/admin/prompt-questions/PromptQuestionsAdmin";

import { Route, Routes } from "react-router-dom";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<PromptQuestionsAdmin />} />
    </Routes>
  );
}