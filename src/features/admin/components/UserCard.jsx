import Button from "@/shared/components/ui/Button";
import { useTranslation } from "react-i18next";

export default function UserCard({ user }) {
  const { t } = useTranslation("admin");

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 hover:shadow-md transition">

      {/* 🔥 Document Image */}
      <div className="w-full h-[160px] bg-gray-light rounded-xl overflow-hidden">
        <img
          src={user.documentImage}
          alt="document"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <div>
        <h3 className="font-semibold text-gray-dark">
          {user.name}
        </h3>
        <p className="text-sm text-gray-DEFAULT">
          #{user.id}
        </p>
      </div>

      {/* Status */}
      <div className="bg-warning/20 text-warning text-xs px-3 py-1 rounded-full w-fit">
        {t("pendingAccounts.requiresReview")}
      </div>

      {/* Details */}
      <div className="text-sm flex flex-col gap-1">

        <div className="flex justify-between">
          <span className="text-gray-DEFAULT">
            {t("pendingAccounts.accountType")}
          </span>
          <span className="text-gray-dark">
            {user.role}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-DEFAULT">
            {t("pendingAccounts.submitted")}
          </span>
          <span className="text-gray-dark">
            {user.date}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-DEFAULT">
            {t("pendingAccounts.documents")}
          </span>
          <span className="text-secondary-500">
            {user.documentsStatus}
          </span>
        </div>

      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-2">

        <Button variant="secondary" fullWidth>
          {t("pendingAccounts.reject")}
        </Button>

        <Button fullWidth>
          {t("pendingAccounts.accept")}
        </Button>

      </div>
    </div>
  );
}