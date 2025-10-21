import TestingTypeCards from "@/components/celpip/CelpipTestingTypeCards";
import { Card } from "@/components/ui/card";
import { Clock, Mic, PenTool, Trophy } from "lucide-react";
// --- Modal Component ---

const Dashboard = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">CELPIP Practice</h1>
          <p className="text-gray-600 mt-1">
            Master your Speaking & Writing skills
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Prepare for CELPIP Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice with realistic test scenarios and receive AI-powered
            feedback to improve your skills
          </p>
        </div>

        {/* Practice Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Speaking Practice */}

          {/* Writing Practice */}

          <TestingTypeCards />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 text-center">
            <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-muted-foreground">Speaking Tasks</div>
          </Card>
          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">60s</div>
            <div className="text-sm text-muted-foreground">Per Task</div>
          </Card>
          <Card className="p-6 text-center">
            <PenTool className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Writing Tasks</div>
          </Card>
          <Card className="p-6 text-center">
            <Mic className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">AI</div>
            <div className="text-sm text-muted-foreground">Feedback</div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
