import React from "react";
import { useTranslation } from "react-i18next";

type LanguageCode = "en" | "vi";

interface LanguageSwitcherProps {
    variant?: "pill" | "menu";
    className?: string;
    onLanguageChange?: (lng: LanguageCode) => void;
}

const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    variant = "pill",
    className = "",
    onLanguageChange,
}) => {
    const { i18n } = useTranslation();

    const handleChange = (lng: LanguageCode) => {
        if (lng !== i18n.language) {
            i18n.changeLanguage(lng);
            onLanguageChange?.(lng);
        }
    };

    if (variant === "menu") {
        return (
            <div className={`flex flex-col divide-y divide-gray-100 ${className}`}>
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleChange(lang.code)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${i18n.language === lang.code
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <span className="text-lg">{lang.flag}</span>
                        {lang.label}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div
            className={`inline-flex items-center rounded-full border border-gray-300 bg-white p-1 text-xs font-medium shadow-sm min-w-[11rem] ${className}`}
        >
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => handleChange(lang.code)}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-full px-3 py-1 transition ${i18n.language === lang.code
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <span>{lang.flag}</span>
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;


