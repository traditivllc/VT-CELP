import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { EvaluationResponse } from "@/types/AssessmentTypes.types";
import Image from "./Images";

const TestScoreBoard: React.FC<{
  data: EvaluationResponse | null;
}> = ({ data: current }) => {
  if (!current) return <div>No assessment data available.</div>;
  return (
    <div className="col-12 feedback-container vt-mt-30">
      <p>
        Your current CELPIP simulation Score is
        <span className="brand-green-gradient rounded-sm p-1 px-2 ms-2 inline-block font-extrabold">
          {current.score}
        </span>
      </p>

      <Accordion type="single" collapsible className="mb-4">
        <AccordionItem value="feedback">
          <AccordionTrigger className="text-green-primary text-lg font-bold">
            Feedback
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {current.feedback?.map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="improvement">
          <AccordionTrigger className="text-green-primary text-lg font-bold">
            Improvement Tips
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {current.tips?.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vocabulary">
          <AccordionTrigger className="text-green-primary text-lg font-bold">
            Vocabulary Examples
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {current.vocabulary_examples?.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="fluency">
          <AccordionTrigger className="text-green-primary text-lg font-bold">
            Fluency & Pacing
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {current.fluency_comment?.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ideal-response">
          <AccordionTrigger className="text-green-primary text-lg font-bold">
            Ideal Response Summary
          </AccordionTrigger>
          <AccordionContent>
            <p>{current.ideal_response_summary}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sample-response">
          <AccordionTrigger className="text-green-primary text-lg font-bold">
            Sample Responses
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {current.sample_responses.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p>
        <Image
          src="/images/img-bulp-small.webp"
          style={{ verticalAlign: "top" }}
          className="w-6 inline-block "
        />
        Avoid awkward phrasings - e.g., rephrase to 'The bride wore a stunning
        sari-inspired dress blendi'
      </p>
    </div>
  );
};

export default TestScoreBoard;
