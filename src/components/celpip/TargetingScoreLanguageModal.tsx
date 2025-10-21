import { useState, type EventHandler, type FormEvent } from "react";
import { Button } from "../ui/button";
import {
  DialogFooter,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function TargetingScoreLanguageModal({
  open,
  onClose,
  onSubmit,
  type,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { targetingScore: string; language: string }) => void;
  type: string | null;
}) {
  const [targetingScore, setTargetingScore] = useState("");
  const [language, setLanguage] = useState("");

  const handleSubmit: EventHandler<FormEvent<HTMLFormElement>> = (e) => {
    e.preventDefault();
    if (targetingScore && language) {
      onSubmit({ targetingScore, language });
      setTargetingScore("");
      setLanguage("");
    }
  };

  const targetingScoreOptions = [
    "CELPIP/CLB 4",
    "CELPIP/CLB 5",
    "CELPIP/CLB 6",
    "CELPIP/CLB 7",
    "CELPIP/CLB 8",
    "CELPIP/CLB 9",
    "CELPIP/CLB 10-12",
  ];

  const languageOptions = [
    { code: "en", name: "English" },
    // Add more languages if needed
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "Speaking"
              ? "Start Speaking Practice"
              : "Start Writing Practice"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Targeting Score</label>
            <Select value={targetingScore} onValueChange={setTargetingScore}>
              <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
                <SelectValue placeholder="Choose a targeting score..." />
              </SelectTrigger>
              <SelectContent>
                {targetingScoreOptions.map((score) => (
                  <SelectItem key={score} value={score}>
                    {score}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md">
                <SelectValue placeholder="Choose a language..." />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!targetingScore || !language}>
              Start
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
