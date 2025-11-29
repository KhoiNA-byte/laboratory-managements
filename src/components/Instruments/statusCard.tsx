import React from 'react';
import { useTranslation } from 'react-i18next';
import { CLASS_NAMES } from '../../constants/instruments/instruments';

interface StatusCardProps {
  title: string;
  value: number;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  value, 
  className = "" 
}) => {
  return (
    <div className={`${CLASS_NAMES.COMPONENTS.STATUS_CARD} ${className}`}>
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
    </div>
  );
};

export const StatusCardsGrid: React.FC<{
  total: number;
  active: number;
  maintenance: number;
  calibrationDue: number;
}> = ({ total, active, maintenance, calibrationDue }) => {
  const { t } = useTranslation();

  return (
    <div className={CLASS_NAMES.LAYOUT.CARD_GRID}>
      <StatusCard 
        title={t('instrumentsPage.summaryCards.totalInstruments')} 
        value={total} 
      />
      <StatusCard 
        title={t('instrumentsPage.summaryCards.active')} 
        value={active} 
      />
      <StatusCard 
        title={t('instrumentsPage.summaryCards.maintenance')} 
        value={maintenance} 
      />
      <StatusCard 
        title={t('instrumentsPage.summaryCards.calibrationDue')} 
        value={calibrationDue} 
      />
    </div>
  );
};