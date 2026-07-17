import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteAccountMutation, useDeleteAccountOtpMutation } from "../../../api/auth/queries";
import { useI18n } from "../../../i18n";
import { getErrorMessage as getMutationError } from "../../../utils/errorUtils";

export default function DangerZoneSection() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const deleteAccountMutation = useDeleteAccountMutation();
  const deleteAccountOtpMutation = useDeleteAccountOtpMutation();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState("");
  const [deleteOtpSent, setDeleteOtpSent] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const sendDeleteOtp = async () => {
    setDeleteError("");

    try {
      await deleteAccountOtpMutation.mutateAsync();
      setDeleteOtpSent(true);
      toast.success(t("danger.otpSent"));
    } catch (error) {
      setDeleteError(getMutationError(error, t("danger.otpSendFailed")));
    }
  };

  const submitDeleteAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    setDeleteError("");

    if (!/^\d{6}$/.test(deleteOtp.trim())) {
      setDeleteError(t("danger.otpInvalid"));
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync(deleteOtp.trim());
      toast.success(t("danger.deleted"));
      navigate("/landing", { replace: true });
    } catch (error) {
      setDeleteError(getMutationError(error, t("danger.deleteFailed")));
    }
  };

  return (
    <>
      <section className="app-surface-padded mb-5 border-destructive/30 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle size={18} />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-destructive">{t("danger.title")}</h2>
              <p className="text-sm font-medium text-muted-foreground">{t("danger.body")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeleteOtp("");
              setDeleteOtpSent(false);
              setDeleteError("");
              setDeleteModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-bold text-destructive transition hover:bg-destructive hover:text-white active:translate-y-px"
          >
            <Trash2 size={16} /> {t("danger.delete")}
          </button>
        </div>
      </section>

      {deleteModalOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => !deleteAccountMutation.isPending && setDeleteModalOpen(false)}
        >
          <form
            onSubmit={submitDeleteAccount}
            onClick={(e) => e.stopPropagation()}
            className="anim-slide w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl"
          >
            <h3 id="delete-account-title" className="mb-2 text-lg font-extrabold text-destructive">
              {t("danger.confirmTitle")}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">{t("danger.confirmBody")}</p>
            <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">
              {t("danger.otpPrompt")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={deleteOtp}
                onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                autoComplete="one-time-code"
                autoFocus
                className="app-control w-full text-foreground tracking-[0.3em]"
              />
              <button
                type="button"
                onClick={sendDeleteOtp}
                disabled={deleteAccountOtpMutation.isPending}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-destructive/40 px-4 py-2 text-sm font-bold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteAccountOtpMutation.isPending
                  ? t("common.saving")
                  : deleteOtpSent
                    ? t("danger.otpResend")
                    : t("danger.otpSend")}
              </button>
            </div>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">{t("danger.otpHint")}</p>
            {deleteError && (
              <div role="alert" className="mt-3 rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-3 text-sm font-bold text-destructive">
                {deleteError}
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteAccountMutation.isPending}
                className="rounded-xl border bg-card px-4 py-2.5 text-sm font-bold transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={deleteOtp.trim().length !== 6 || deleteAccountMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-white transition hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={15} />
                {deleteAccountMutation.isPending ? t("common.saving") : t("danger.confirm")}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </>
  );
}
