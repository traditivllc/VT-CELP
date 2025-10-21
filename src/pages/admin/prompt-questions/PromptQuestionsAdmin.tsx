
import api from "@/lib/axios";
import { useEffect, useState, useRef } from "react";

import PromptQuestionsForm, {
  type PromptQuestionFormValues,
} from "./PromptQuestionsForm";
import { AxiosError } from "axios";
import Image from "@/components/Images";
import { getEnv } from "@/lib/utils";

interface PromptQuestion {
  id: number;
  celpTestPrompt: {
    id: number;
    name: string;
    // ...other fields
  };
  celpLanguage: {
    id: number;
    name: string;
    code: string;
    // ...other fields
  };
  name: string;
  imagePath?: string | null;
  isActive?: boolean;
}

export default function PromptQuestionsAdmin() {
  const [questions, setQuestions] = useState<PromptQuestion[]>([]);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState<
    (PromptQuestionFormValues & { id?: number }) | null
  >(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all prompt questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/celpip/prompt-questions");
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch prompt questions", error);
    }
    setLoading(false);
  };

  // Create
  const handleCreate = async (data: FormData) => {
    try {
      await api.post("/celpip/prompt-questions", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchQuestions();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create prompt question", error);
    }
  };

  // Edit
  const handleEdit = async (data: FormData) => {
    if (!editing || !editing.id) return;
    try {
      await api.patch(`/celpip/prompt-questions/${editing.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchQuestions();
      setEditing(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to edit prompt question", error);
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message);
        return;
      }
      if (error instanceof Error) {
        alert(error.message);
        return;
      }
      alert("An unexpected error occurred.");
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this prompt question?")) return;
    try {
      await api.delete(`/celpip/prompt-questions/${id}`);
      fetchQuestions();
    } catch (error) {
      console.error("Failed to delete prompt question", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  // Scroll to form when editing
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showForm]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prompt Questions Admin</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
      >
        Create New
      </button>
      {showForm && (
        <div className="mb-6">
          <PromptQuestionsForm
            isEdit={!!editing}
            defaultValues={
              editing
                ? {
                    celpTestPromptId: editing.celpTestPromptId,
                    celpLanguageId: editing.celpLanguageId,
                    name: editing.name,
                    imagePath: editing.imagePath,
                    isActive: editing.isActive,
                  }
                : undefined
            }
            onSubmit={editing ? handleEdit : handleCreate}
            formRef={formRef}
          />
          <button
            className="mt-2 text-gray-500"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-2">ID</th>
                <th className="border px-2">Prompt</th>
                <th className="border px-2">Language</th>
                <th className="border px-2">Name</th>
                <th className="border px-2">Image Path</th>
                <th className="border px-2">Active</th>
                <th className="border px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id}>
                  <td className="border px-2">{q.id}</td>
                  <td className="border px-2">{q.celpTestPrompt?.name}</td>
                  <td className="border px-2">
                    {q.celpLanguage?.name} ({q.celpLanguage?.code})
                  </td>
                  <td className="border px-2">{q.name}</td>
                  <td className="border px-2">
                    {q.imagePath && (
                      <Image
                        src={
                          getEnv("API_BASE_URL") +
                          "/public/images/" +
                          q.imagePath
                        }
                        alt={q.imagePath}
                        className="mx-auto max-h-40 mb-2"
                        width={400}
                        height={400}
                      />
                    )}
                  </td>
                  <td className="border px-2">{q.isActive ? "Yes" : "No"}</td>
                  <td className="border px-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => {
                        setEditing({
                          id: q.id,
                          celpTestPromptId: q.celpTestPrompt.id,
                          celpLanguageId: q.celpLanguage.id,
                          name: q.name,
                          imagePath: q.imagePath ?? undefined,
                          isActive: q.isActive,
                        });
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(q.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
