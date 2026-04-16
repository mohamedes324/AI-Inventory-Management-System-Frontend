import { useAuthFlow } from "@/features/auth/hooks/useAuthFlow";

const RedirectPage = () => {
  useAuthFlow();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-light">
      <div className="p-8 rounded-2xl shadow-lg text-center w-[320px] bg-white">
        {/* Spinner */}
        <div className="flex justify-center mb-5">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-2 text-gray-dark">
          Preparing your dashboard
        </h2>

        {/* Description */}
        <p className="text-sm text-gray">
          Please wait while we set things up for you...
        </p>
      </div>
    </div>
  );
};

export default RedirectPage;