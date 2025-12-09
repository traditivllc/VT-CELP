import { getPromptsByType } from "@/services/celpip-services";
import type { TestPrompt, TestType } from "@/types/AssessmentTypes.type";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function TaskListPage() {
  const { testTypeSlug } = useParams<{ testTypeSlug: TestType["slug"] }>();
  const [typeList, setTypeList] = useState<TestPrompt[]>([]);

  useEffect(() => {
    if (testTypeSlug === undefined) return;
    const fetchPrompts = async () => {
      const prompts = await getPromptsByType(testTypeSlug);
      setTypeList(prompts);
    };
    fetchPrompts();
  }, [testTypeSlug]);

  return (
    <main>
      <section>
        <div className="max-w-2xl mx-auto p-6 ">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              CELPIP {testTypeSlug} Practice
            </h1>
            <p className="text-gray-700 leading-relaxed">
              The CELPIP Speaking Test comprises eight tasks that evaluate an
              individual's ability to communicate with clarity in everyday
              contexts, while also demonstrating the capacity to articulate
              ideas and opinions effectively.
            </p>
          </div>

          <div className="space-y-3">
            {typeList.map((part, index) => (
              <Link
                to={`/test/${testTypeSlug}/${part.promptUuid}`}
                key={part.namePrefix}
                className="flex items-center p-4 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 hover:border-green-primary hover:scale-102 transition-all cursor-pointer !no-underline"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 font-semibold rounded-full mr-4">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium !text-gray-900 mb-0">
                    <span className="text-gray-400 border-e border-gray-200 pr-2 inline-block me-2">
                      {part.namePrefix}
                    </span>
                    {part.name}
                  </h4>
                </div>
                <div className="text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
