import React from 'react';
import { useTranslation } from 'react-i18next';
import { CLASS_NAMES } from '../../constants/instruments/instrumentDetail'; 
import { Instrument } from '../../store/types';

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string; 

  unit?: string;
  showEmpty?: boolean;
  valueHasUnit?: boolean;
}

export const DetailSection: React.FC<DetailSectionProps> = ({ 
  title, 
  children,
  className = '' 
}) => {
  return (
    <div className={`${CLASS_NAMES.MODAL.SECTION} ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
};

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  unit?: string; // 🔹 THÊM PROP UNIT
  showEmpty?: boolean; // 🔹 THÊM PROP ĐỂ HIỂN THỊ KHI KHÔNG CÓ GIÁ TRỊ
}

export const DetailField: React.FC<DetailFieldProps> = ({ 
  label, 
  value, 
  className = '',
  unit,
  showEmpty = true,
  valueHasUnit = false
}) => {
  const { t } = useTranslation();
  
  // 🔹 XỬ LÝ HIỂN THỊ GIÁ TRỊ VỚI UNIT
  const renderValue = () => {
    if (!value && !showEmpty) return null;
    
    if (!value) {
      return <span className="text-gray-400 italic">—</span>;
    }
    
    // 🔹 CHỈ THÊM UNIT NẾU GIÁ TRỊ CHƯA CÓ UNIT VÀ CÓ UNIT TRUYỀN VÀO
    if (unit && typeof value === 'string' && !valueHasUnit) {
      // 🔹 KIỂM TRA XEM GIÁ TRỊ ĐÃ CÓ UNIT CHƯA
      const hasExistingUnit = /\s*(°C|℃|μL|ml|mL|L|mg|g|kg|Hz|MHz|GHz|V|mV|kV|A|mA|Ω|kΩ|MΩ)$/i.test(value);
      if (!hasExistingUnit) {
        return `${value} ${unit}`;
      }
    }
    
    return value;
  };


  const displayValue = renderValue();
  
  // 🔹 NẾU KHÔNG CÓ GIÁ TRỊ VÀ KHÔNG HIỂN THỊ EMPTY, RETURN NULL
  if (!displayValue && !showEmpty) return null;

  return (
    <div className={className}>
      <label className="text-sm text-gray-500 block mb-1">{label}</label>
      <div className="text-gray-900 font-medium">
        {displayValue}
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
  getStatusConfig: (status: string) => any;
  className?: string; // 🔹 THÊM CLASSNAME PROP
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  getStatusConfig,
  className = '' 
}) => {
  const { t } = useTranslation();
  const statusConfig = getStatusConfig(status);
  
  return (
    <span className={`${CLASS_NAMES.STATUS_BADGE} ${statusConfig.color} ${className}`}>
      {t(statusConfig.translationKey)}
    </span>
  );
};

// 🔹 THÊM COMPONENT MỚI: AlertBadge cho calibration
interface AlertBadgeProps {
  isWarning: boolean;
  message: string;
  className?: string;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({ 
  isWarning, 
  message, 
  className = '' 
}) => {
  const badgeClass = isWarning 
    ? 'bg-red-100 text-red-800 border-red-200' 
    : 'bg-green-100 text-green-800 border-green-200';
  
  return (
    <span className={`${CLASS_NAMES.STATUS_BADGE} border ${badgeClass} ${className}`}>
      {message}
    </span>
  );
};

// 🔹 THÊM COMPONENT MỚI: InfoCard cho test types và reagents
interface InfoCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  subtitle, 
  badge,
  children,
  className = '' 
}) => {
  return (
    <div className={`${CLASS_NAMES.INFO_CARD} ${className}`}>
      <div className="flex justify-between items-start">
        <span className="font-medium text-gray-900">{title}</span>
        {badge && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      {children}
    </div>
  );
};

// 🔹 THÊM COMPONENT MỚI: ReagentCard
interface ReagentCardProps {
  reagent: {
    id: string;
    name: string;
    lot_number: string;
    manufacturer: string;
    quantity: number;
    unit: string;
    expiry_date: string;
    location: string;
  };
  formatDate: (date: string) => string;
}

export const ReagentCard: React.FC<ReagentCardProps> = ({ reagent, formatDate }) => {
  const { t } = useTranslation();
  const isLowStock = reagent.quantity <= 0;

  return (
    <div className={CLASS_NAMES.INFO_CARD}>
      <div className="flex justify-between items-start">
        <span className="font-medium text-gray-900">{reagent.name}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {reagent.quantity} {reagent.unit}
        </span>
      </div>
      <div className="text-xs text-gray-600 mt-1 space-y-1">
        <div>
          {t('modals.instrumentDetails.lot')}: {reagent.lot_number} • 
          {t('modals.instrumentDetails.mfg')}: {reagent.manufacturer}
        </div>
        <div>
          {t('modals.instrumentDetails.expires')}: {formatDate(reagent.expiry_date)} • 
          {t('modals.instrumentDetails.storage')}: {reagent.location}
        </div>
      </div>
    </div>
  );
};