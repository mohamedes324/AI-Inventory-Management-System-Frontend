import { useAuthFlow } from "@/features/auth/hooks/useAuthFlow";

const RedirectPage = () => {
  useAuthFlow();

  return (
    <div className="h-screen flex items-center justify-center bg-background-app">
      <div className="p-8 rounded-2xl shadow-lg text-center w-[320px] bg-background-card border border-border-primary">
        <div className="flex justify-center mb-5">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-lg font-semibold mb-2 text-text-primary">Preparing your dashboard</h2>
        <p className="text-sm text-text-secondary">Please wait while we set things up for you...</p>
      </div>
    </div>
  );
};

export default RedirectPage;