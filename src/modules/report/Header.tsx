import { useTranslation } from "react-i18next";

export function HeaderReport() {
  const { t } = useTranslation("common");
  return (
    <div>
      <h1 className="text-3xl font-bold">{t("reportsPage.title")}</h1>
      <p className="text-muted-foreground">
        {t("reportsPage.subtitle")}
      </p>
    </div>
  );
}
