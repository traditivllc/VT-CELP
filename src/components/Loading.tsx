import { Loader2 } from "lucide-react";

export const FullScreenLoading = ({ text = "Loading" }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-998 flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-lg font-medium text-gray-700">{text}</p>
      </div>
    </div>
  );
};
