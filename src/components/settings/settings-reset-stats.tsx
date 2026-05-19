import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useTranslation } from "react-i18next";

interface SettingsResetStatsDialogProps {
  resetScore: () => void;
}

function SettingsResetStatsDialog({
  resetScore,
}: SettingsResetStatsDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button type="button" className="button danger">
          {t("settings.stats.button")}
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialog-overlay" />

        <AlertDialog.Content className="alert dialog-content">
          <AlertDialog.Title className="dialog-title">
            {t("settings.stats.confirm.title")}
          </AlertDialog.Title>

          <AlertDialog.Description>
            {t("settings.stats.confirm.description")}
          </AlertDialog.Description>

          <div className="dialog-actions">
            <AlertDialog.Cancel asChild>
              <button type="button" className="button default">
                {t("common.cancel")}
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                type="button"
                className="button danger"
                onClick={resetScore}
              >
                {t("common.confirm")}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export default SettingsResetStatsDialog;
