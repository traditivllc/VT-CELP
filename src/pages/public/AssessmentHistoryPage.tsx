import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AssessmentHistoryPage: React.FC = () => {
  return (
    <div className="p-8">
      <Link to="/" className="mb-4 inline-block">
        <Button variant={"outline"}>
          <ArrowLeft /> Back
        </Button>
      </Link>
    </div>
  );
};

export default AssessmentHistoryPage;
