/**
 * Dynamic Line Item Builder
 * Main component for building invoice line items with service-specific custom columns
 * Integrates all 7 service type forms with unified interface
 */

import React, { useState } from 'react';
import {
  ServiceType,
  ServiceData,
  ROCFilingServiceData,
  SecretarialAuditServiceData,
  BoardMeetingServiceData,
  TrademarkIPServiceData,
  LegalDraftingServiceData,
  RetainerServiceData,
  DueDiligenceServiceData,
} from '@/types/service-types';
import { ServiceTypeSelector } from './ServiceTypeSelector';
import { ROCFilingForm } from './forms/ROCFilingForm';
import { SecretarialAuditForm } from './forms/SecretarialAuditForm';
import { BoardMeetingForm } from './forms/BoardMeetingForm';
import { TrademarkIPForm } from './forms/TrademarkIPForm';
import { LegalDraftingForm } from './forms/LegalDraftingForm';
import { RetainerForm } from './forms/RetainerForm';
import { DueDiligenceForm } from './forms/DueDiligenceForm';
import { AuraButton } from '@/components/ui/aura-button';
import { Plus } from 'lucide-react';

// ============================================
// INTERFACES
// ============================================

interface LineItemData {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  serviceType: ServiceType;
  serviceData?: ServiceData;
}

interface DynamicLineItemBuilderProps {
  onAddLineItem: (lineItem: LineItemData) => void;
  onCancel?: () => void;
}

// ============================================
// INITIAL DATA CREATORS
// ============================================

const createInitialROCFilingData = (): ROCFilingServiceData => ({
  rows: [{ formName: '', srn: '', filingDate: '', govtFees: 0, professionalFees: 0 }],
  totalGovtFees: 0,
  totalProfessionalFees: 0,
});

const createInitialSecretarialAuditData = (): SecretarialAuditServiceData => ({
  rows: [{ period: '', auditType: 'Annual', deliverables: '', hours: 0, fee: 0 }],
  totalFees: 0,
  totalHours: 0,
});

const createInitialBoardMeetingData = (): BoardMeetingServiceData => ({
  rows: [{ meetingType: 'Board Meeting', meetingDate: '', noticePreparation: true, minutesDrafting: true, formsField: '', fee: 0 }],
  totalFees: 0,
});

const createInitialTrademarkIPData = (): TrademarkIPServiceData => ({
  rows: [{ description: '', applicationNumber: '', class: '', filingDate: '', govtFees: 0, professionalFees: 0 }],
  totalGovtFees: 0,
  totalProfessionalFees: 0,
});

const createInitialLegalDraftingData = (): LegalDraftingServiceData => ({
  rows: [{ documentType: '', pages: 0, revisions: 1, deliveryDate: '', fee: 0 }],
  totalFees: 0,
  totalPages: 0,
});

const createInitialRetainerData = (): RetainerServiceData => ({
  rows: [{ period: '', hours: 0, ratePerHour: 0, servicesIncluded: '', fee: 0 }],
  totalFees: 0,
  totalHours: 0,
});

const createInitialDueDiligenceData = (): DueDiligenceServiceData => ({
  rows: [{ scope: '', documentsReviewed: 0, reportType: 'Comprehensive Report', timeline: '', fee: 0 }],
  totalFees: 0,
  totalDocuments: 0,
});

// ============================================
// MAIN COMPONENT
// ============================================

export const DynamicLineItemBuilder: React.FC<DynamicLineItemBuilderProps> = ({
  onAddLineItem,
  onCancel,
}) => {
  // State
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.GENERAL);
  const [description, setDescription] = useState('');
  const [gstRate, setGstRate] = useState(18);

  // Service-specific data states
  const [rocFilingData, setRocFilingData] = useState<ROCFilingServiceData>(createInitialROCFilingData());
  const [secretarialAuditData, setSecretarialAuditData] = useState<SecretarialAuditServiceData>(createInitialSecretarialAuditData());
  const [boardMeetingData, setBoardMeetingData] = useState<BoardMeetingServiceData>(createInitialBoardMeetingData());
  const [trademarkIPData, setTrademarkIPData] = useState<TrademarkIPServiceData>(createInitialTrademarkIPData());
  const [legalDraftingData, setLegalDraftingData] = useState<LegalDraftingServiceData>(createInitialLegalDraftingData());
  const [retainerData, setRetainerData] = useState<RetainerServiceData>(createInitialRetainerData());
  const [dueDiligenceData, setDueDiligenceData] = useState<DueDiligenceServiceData>(createInitialDueDiligenceData());

  // General service (simple rate/quantity)
  const [generalRate, setGeneralRate] = useState(0);
  const [generalQuantity, setGeneralQuantity] = useState(1);

  // ============================================
  // HELPER: Calculate total amount based on service type
  // ============================================
  const calculateTotalAmount = (): number => {
    switch (serviceType) {
      case ServiceType.ROC_FILING:
        return rocFilingData.totalGovtFees + rocFilingData.totalProfessionalFees;
      case ServiceType.SECRETARIAL_AUDIT:
        return secretarialAuditData.totalFees;
      case ServiceType.BOARD_MEETING:
        return boardMeetingData.totalFees;
      case ServiceType.TRADEMARK_IP:
        return trademarkIPData.totalGovtFees + trademarkIPData.totalProfessionalFees;
      case ServiceType.LEGAL_DRAFTING:
        return legalDraftingData.totalFees;
      case ServiceType.RETAINER:
        return retainerData.totalFees;
      case ServiceType.DUE_DILIGENCE:
        return dueDiligenceData.totalFees;
      case ServiceType.GENERAL:
      default:
        return generalRate * generalQuantity;
    }
  };

  // ============================================
  // HANDLER: Service type change
  // ============================================
  const handleServiceTypeChange = (newServiceType: ServiceType) => {
    setServiceType(newServiceType);
    // Reset description when changing service type
    setDescription('');
  };

  // ============================================
  // HANDLER: Add line item
  // ============================================
  const handleAddLineItem = () => {
    if (!description.trim()) {
      alert('Please enter a description for this service');
      return;
    }

    const totalAmount = calculateTotalAmount();

    if (totalAmount <= 0) {
      alert('Total amount must be greater than zero');
      return;
    }

    let serviceData: ServiceData | undefined;
    if (serviceType !== ServiceType.GENERAL) {
      switch (serviceType) {
        case ServiceType.ROC_FILING:
          serviceData = rocFilingData;
          break;
        case ServiceType.SECRETARIAL_AUDIT:
          serviceData = secretarialAuditData;
          break;
        case ServiceType.BOARD_MEETING:
          serviceData = boardMeetingData;
          break;
        case ServiceType.TRADEMARK_IP:
          serviceData = trademarkIPData;
          break;
        case ServiceType.LEGAL_DRAFTING:
          serviceData = legalDraftingData;
          break;
        case ServiceType.RETAINER:
          serviceData = retainerData;
          break;
        case ServiceType.DUE_DILIGENCE:
          serviceData = dueDiligenceData;
          break;
      }
    }

    const lineItem: LineItemData = {
      description: description.trim(),
      quantity: serviceType === ServiceType.GENERAL ? generalQuantity : 1,
      rate: serviceType === ServiceType.GENERAL ? generalRate : totalAmount,
      amount: totalAmount,
      gstRate,
      serviceType,
      serviceData,
    };

    onAddLineItem(lineItem);

    // Reset form
    setDescription('');
    setGeneralRate(0);
    setGeneralQuantity(1);
    setRocFilingData(createInitialROCFilingData());
    setSecretarialAuditData(createInitialSecretarialAuditData());
    setBoardMeetingData(createInitialBoardMeetingData());
    setTrademarkIPData(createInitialTrademarkIPData());
    setLegalDraftingData(createInitialLegalDraftingData());
    setRetainerData(createInitialRetainerData());
    setDueDiligenceData(createInitialDueDiligenceData());
  };

  // ============================================
  // RENDER: Service-specific form
  // ============================================
  const renderServiceForm = () => {
    switch (serviceType) {
      case ServiceType.ROC_FILING:
        return <ROCFilingForm data={rocFilingData} onChange={setRocFilingData} />;
      case ServiceType.SECRETARIAL_AUDIT:
        return <SecretarialAuditForm data={secretarialAuditData} onChange={setSecretarialAuditData} />;
      case ServiceType.BOARD_MEETING:
        return <BoardMeetingForm data={boardMeetingData} onChange={setBoardMeetingData} />;
      case ServiceType.TRADEMARK_IP:
        return <TrademarkIPForm data={trademarkIPData} onChange={setTrademarkIPData} />;
      case ServiceType.LEGAL_DRAFTING:
        return <LegalDraftingForm data={legalDraftingData} onChange={setLegalDraftingData} />;
      case ServiceType.RETAINER:
        return <RetainerForm data={retainerData} onChange={setRetainerData} />;
      case ServiceType.DUE_DILIGENCE:
        return <DueDiligenceForm data={dueDiligenceData} onChange={setDueDiligenceData} />;
      case ServiceType.GENERAL:
      default:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (₹)
              </label>
              <input
                type="number"
                value={generalRate}
                onChange={(e) => setGeneralRate(parseFloat(e.target.value) || 0)}
                min="0"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={generalQuantity}
                onChange={(e) => setGeneralQuantity(parseFloat(e.target.value) || 1)}
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
          </div>
        );
    }
  };

  // ============================================
  // RENDER: Main component
  // ============================================
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Add Service Line Item</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Service Type Selector */}
      <ServiceTypeSelector value={serviceType} onChange={handleServiceTypeChange} />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a clear description of the service provided"
        />
      </div>

      {/* Service-specific form */}
      {renderServiceForm()}

      {/* GST Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GST Rate (%)
        </label>
        <select
          value={gstRate}
          onChange={(e) => setGstRate(parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>0% (No GST)</option>
          <option value={5}>5%</option>
          <option value={12}>12%</option>
          <option value={18}>18%</option>
          <option value={28}>28%</option>
        </select>
      </div>

      {/* Total Amount Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-900">Service Amount (before GST):</span>
          <span className="text-lg font-bold text-blue-900">₹{calculateTotalAmount().toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <AuraButton type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </AuraButton>
        )}
        <AuraButton
          type="button"
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleAddLineItem}
        >
          Add to Invoice
        </AuraButton>
      </div>
    </div>
  );
};
