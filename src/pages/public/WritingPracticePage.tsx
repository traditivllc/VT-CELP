import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import WritingTestInterface from "@/components/WritingTestInterface";
import { ArrowLeft, Check, Lock, PenTool } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const WRITING_TASKS = [
  {
    id: 1,
    title: "Writing an Email",
    description:
      "Write a formal or informal email responding to a given situation",
    timeLimit: 27, // 27 minutes
    unlocked: true,
    completed: false,
  },
  {
    id: 2,
    title: "Responding to Survey Questions",
    description:
      "Provide detailed responses to survey questions about your opinions",
    timeLimit: 26, // 26 minutes
    unlocked: false,
    completed: false,
  },
];

const WritingPracticePage = () => {
  const [tasks, setTasks] = useState(WRITING_TASKS);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const handleTaskComplete = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: true };
        }
        if (task.id === taskId + 1) {
          return { ...task, unlocked: true };
        }
        return task;
      })
    );
    setSelectedTask(null);
  };

  const getTaskStatus = (task: (typeof WRITING_TASKS)[0]) => {
    if (task.completed) return "completed";
    if (task.unlocked) return "unlocked";
    return "locked";
  };

  if (selectedTask) {
    return (
      <WritingTestInterface
        task={tasks.find((t) => t.id === selectedTask)!}
        onComplete={() => handleTaskComplete(selectedTask)}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h2 className="text-xl font-semibold">Writing Practice</h2>
          <p className="text-sm text-muted-foreground">
            Complete tasks to unlock the next one
          </p>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tasks.map((task) => {
            const status = getTaskStatus(task);

            return (
              <Card
                key={task.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  status === "completed"
                    ? "bg-success-light border-success"
                    : status === "unlocked"
                    ? "hover:bg-accent"
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() =>
                  status === "unlocked" && setSelectedTask(task.id)
                }
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {status === "completed" ? (
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-success-foreground" />
                      </div>
                    ) : status === "unlocked" ? (
                      <div className="w-6 h-6 brand-green-gradient rounded-full flex items-center justify-center">
                        <PenTool className="w-3 h-3 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">
                        {task.title}
                      </h3>
                      <Badge
                        variant={
                          status === "completed" ? "default" : "secondary"
                        }
                        className={
                          status === "completed"
                            ? "bg-success text-success-foreground"
                            : status === "unlocked"
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                      >
                        {status === "completed"
                          ? "Done"
                          : status === "unlocked"
                          ? "Ready"
                          : "Locked"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {task.description}
                    </p>
                    <p className="text-xs text-warning font-medium">
                      {task.timeLimit} minutes
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-accent/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <PenTool className="w-8 h-8 text-accent-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">Choose a Writing Task</h3>
          <p className="text-muted-foreground mb-6">
            Select a task from the sidebar to begin your practice session.
            Complete each task to unlock the next one in the sequence.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>🟢 Completed tasks</p>
            <p>🔵 Available tasks</p>
            <p>🔒 Locked tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingPracticePage;
