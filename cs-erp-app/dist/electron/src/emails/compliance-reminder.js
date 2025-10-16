"use strict";
/**
 * Professional Compliance Reminder Email Template
 * Critical deadlines and regulatory updates for CS clients
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceReminderEmail = void 0;
const components_1 = require("@react-email/components");
const react_1 = __importDefault(require("react"));
const ComplianceReminderEmail = ({ customerName = "Sunrise Industries Ltd", companyName = "Sharma & Associates", companyLogo, companyEmail = "contact@sharmaassociates.com", companyPhone = "+91 98765 43210", urgentItems = [
    {
        title: "ROC Annual Filing",
        description: "Annual filing for FY 2023-24 must be completed",
        dueDate: "30th September 2024",
        priority: "CRITICAL",
        penalty: 50000,
        actionRequired: "Submit audited financials and annual return"
    }
], upcomingItems = [
    {
        title: "AGM Notice",
        description: "Annual General Meeting notice to be sent",
        dueDate: "15th October 2024",
        category: "Corporate Governance"
    }
], actionUrl = "#" }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICAL': return '#dc2626';
            case 'HIGH': return '#ea580c';
            case 'MEDIUM': return '#d97706';
            default: return '#6b7280';
        }
    };
    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'CRITICAL': return '🚨';
            case 'HIGH': return '⚠️';
            case 'MEDIUM': return '📋';
            default: return '📝';
        }
    };
    return (react_1.default.createElement(components_1.Html, null,
        react_1.default.createElement(components_1.Head, null),
        react_1.default.createElement(components_1.Preview, null, `Compliance Alert: ${urgentItems.length} critical items require immediate attention`),
        react_1.default.createElement(components_1.Body, { style: main },
            react_1.default.createElement(components_1.Container, { style: container },
                react_1.default.createElement(components_1.Section, { style: header },
                    react_1.default.createElement(components_1.Row, null,
                        react_1.default.createElement(components_1.Column, null,
                            companyLogo && (react_1.default.createElement(components_1.Img, { src: companyLogo, width: "120", height: "40", alt: companyName, style: logo })),
                            react_1.default.createElement(components_1.Heading, { style: companyNameHeading }, companyName),
                            react_1.default.createElement(components_1.Text, { style: companySubtitle }, "Company Secretary & Legal Consultants")),
                        react_1.default.createElement(components_1.Column, { align: "right" },
                            react_1.default.createElement(components_1.Text, { style: alertBadge }, "COMPLIANCE ALERT")))),
                react_1.default.createElement(components_1.Hr, { style: hr }),
                react_1.default.createElement(components_1.Section, { style: alertHeader },
                    react_1.default.createElement(components_1.Text, { style: alertTitle }, "\uD83D\uDEA8 Compliance Deadline Alert"),
                    react_1.default.createElement(components_1.Text, { style: greeting },
                        "Dear ",
                        customerName,
                        ","),
                    react_1.default.createElement(components_1.Text, { style: alertMessage },
                        "We're monitoring your compliance calendar and have identified ",
                        urgentItems.length,
                        " critical item",
                        urgentItems.length !== 1 ? 's' : '',
                        " that require immediate attention to avoid penalties and ensure regulatory compliance.")),
                urgentItems.length > 0 && (react_1.default.createElement(components_1.Section, { style: urgentSection },
                    react_1.default.createElement(components_1.Text, { style: sectionTitle }, "\u26A1 Immediate Action Required"),
                    urgentItems.map((item, index) => (react_1.default.createElement(components_1.Section, { key: index, style: urgentItemCard },
                        react_1.default.createElement(components_1.Row, { style: urgentItemHeader },
                            react_1.default.createElement(components_1.Column, null,
                                react_1.default.createElement(components_1.Text, { style: urgentItemTitle },
                                    getPriorityIcon(item.priority),
                                    " ",
                                    item.title),
                                react_1.default.createElement(components_1.Text, { style: urgentItemCategory },
                                    react_1.default.createElement("span", { style: {
                                            backgroundColor: getPriorityColor(item.priority),
                                            color: '#ffffff',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        } }, item.priority))),
                            react_1.default.createElement(components_1.Column, { align: "right" },
                                react_1.default.createElement(components_1.Text, { style: dueDate },
                                    "Due: ",
                                    item.dueDate),
                                item.penalty && (react_1.default.createElement(components_1.Text, { style: penaltyAmount },
                                    "Penalty: ",
                                    formatCurrency(item.penalty))))),
                        react_1.default.createElement(components_1.Text, { style: itemDescription }, item.description),
                        item.actionRequired && (react_1.default.createElement(components_1.Section, { style: actionRequired },
                            react_1.default.createElement(components_1.Text, { style: actionRequiredTitle }, "Action Required:"),
                            react_1.default.createElement(components_1.Text, { style: actionRequiredText }, item.actionRequired)))))))),
                upcomingItems.length > 0 && (react_1.default.createElement(components_1.Section, { style: upcomingSection },
                    react_1.default.createElement(components_1.Text, { style: sectionTitle }, "\uD83D\uDCC5 Upcoming Deadlines"),
                    upcomingItems.map((item, index) => (react_1.default.createElement(components_1.Section, { key: index, style: upcomingItemCard },
                        react_1.default.createElement(components_1.Row, null,
                            react_1.default.createElement(components_1.Column, null,
                                react_1.default.createElement(components_1.Text, { style: upcomingItemTitle }, item.title),
                                react_1.default.createElement(components_1.Text, { style: upcomingItemCategory }, item.category),
                                react_1.default.createElement(components_1.Text, { style: upcomingItemDescription }, item.description)),
                            react_1.default.createElement(components_1.Column, { align: "right" },
                                react_1.default.createElement(components_1.Text, { style: upcomingDueDate }, item.dueDate)))))))),
                react_1.default.createElement(components_1.Section, { style: buttonSection },
                    react_1.default.createElement(components_1.Button, { style: primaryButton, href: actionUrl }, "View Compliance Dashboard"),
                    react_1.default.createElement(components_1.Text, { style: buttonSubtext }, "Access your complete compliance calendar and track all deadlines")),
                react_1.default.createElement(components_1.Section, { style: importantNotes },
                    react_1.default.createElement(components_1.Text, { style: notesTitle }, "\uD83D\uDCCB Important Reminders"),
                    react_1.default.createElement(components_1.Text, { style: noteItem },
                        "\u2022 ",
                        react_1.default.createElement("strong", null, "Late Filing Penalties:"),
                        " ROC imposes significant penalties for delayed filings"),
                    react_1.default.createElement(components_1.Text, { style: noteItem },
                        "\u2022 ",
                        react_1.default.createElement("strong", null, "Document Preparation:"),
                        " Ensure all required documents are ready in advance"),
                    react_1.default.createElement(components_1.Text, { style: noteItem },
                        "\u2022 ",
                        react_1.default.createElement("strong", null, "Digital Signatures:"),
                        " Valid DSCs are required for all e-filings"),
                    react_1.default.createElement(components_1.Text, { style: noteItem },
                        "\u2022 ",
                        react_1.default.createElement("strong", null, "Professional Support:"),
                        " Contact us immediately if you need assistance")),
                react_1.default.createElement(components_1.Section, { style: contactSection },
                    react_1.default.createElement(components_1.Text, { style: contactTitle }, "Need Immediate Assistance?"),
                    react_1.default.createElement(components_1.Text, { style: contactText }, "Our team is ready to help you meet these deadlines:"),
                    react_1.default.createElement(components_1.Row, { style: contactInfo },
                        react_1.default.createElement(components_1.Column, { align: "center" },
                            react_1.default.createElement(components_1.Button, { style: contactButton, href: `mailto:${companyEmail}` }, "\uD83D\uDCE7 Email Us")),
                        react_1.default.createElement(components_1.Column, { align: "center" },
                            react_1.default.createElement(components_1.Button, { style: contactButton, href: `tel:${companyPhone}` }, "\uD83D\uDCDE Call Now")))),
                react_1.default.createElement(components_1.Hr, { style: hr }),
                react_1.default.createElement(components_1.Section, { style: footer },
                    react_1.default.createElement(components_1.Text, { style: footerText },
                        companyName,
                        " | Company Secretary Practice"),
                    react_1.default.createElement(components_1.Text, { style: footerText },
                        "Email: ",
                        react_1.default.createElement(components_1.Link, { href: `mailto:${companyEmail}`, style: link }, companyEmail),
                        companyPhone && (react_1.default.createElement(react_1.default.Fragment, null,
                            ' ',
                            " | Phone: ",
                            react_1.default.createElement(components_1.Link, { href: `tel:${companyPhone}`, style: link }, companyPhone)))),
                    react_1.default.createElement(components_1.Text, { style: footerDisclaimer }, "This is an automated compliance reminder. Please ensure all deadlines are met to avoid penalties."))))));
};
exports.ComplianceReminderEmail = ComplianceReminderEmail;
exports.default = exports.ComplianceReminderEmail;
// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
};
const container = {
    margin: '0 auto',
    padding: '20px 20px 48px',
    maxWidth: '600px'
};
const header = {
    marginBottom: '32px'
};
const logo = {
    marginBottom: '16px'
};
const companyNameHeading = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
};
const companySubtitle = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 16px 0'
};
const alertBadge = {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: '20px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};
const hr = {
    borderColor: '#e5e7eb',
    margin: '24px 0'
};
const alertHeader = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px'
};
const alertTitle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#dc2626',
    margin: '0 0 16px 0'
};
const greeting = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 16px 0'
};
const alertMessage = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#7f1d1d',
    margin: '0'
};
const urgentSection = {
    marginBottom: '32px'
};
const sectionTitle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 20px 0'
};
const urgentItemCard = {
    backgroundColor: '#fef2f2',
    border: '2px solid #fca5a5',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px'
};
const urgentItemHeader = {
    marginBottom: '12px'
};
const urgentItemTitle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#7f1d1d',
    margin: '0 0 8px 0'
};
const urgentItemCategory = {
    margin: '0'
};
const dueDate = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#dc2626',
    margin: '0 0 4px 0'
};
const penaltyAmount = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#dc2626',
    margin: '0'
};
const itemDescription = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#374151',
    margin: '0 0 16px 0'
};
const actionRequired = {
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: '6px',
    padding: '12px'
};
const actionRequiredTitle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#92400e',
    margin: '0 0 4px 0'
};
const actionRequiredText = {
    fontSize: '14px',
    color: '#92400e',
    margin: '0'
};
const upcomingSection = {
    marginBottom: '32px'
};
const upcomingItemCard = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '12px'
};
const upcomingItemTitle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 4px 0'
};
const upcomingItemCategory = {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 8px 0'
};
const upcomingItemDescription = {
    fontSize: '14px',
    color: '#4b5563',
    margin: '0'
};
const upcomingDueDate = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4f46e5',
    margin: '0'
};
const buttonSection = {
    textAlign: 'center',
    margin: '32px 0'
};
const primaryButton = {
    backgroundColor: '#4f46e5',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '14px 28px'
};
const buttonSubtext = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '12px 0 0 0'
};
const importantNotes = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '32px'
};
const notesTitle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0c4a6e',
    margin: '0 0 16px 0'
};
const noteItem = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#0c4a6e',
    margin: '0 0 8px 0'
};
const contactSection = {
    textAlign: 'center',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px'
};
const contactTitle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 12px 0'
};
const contactText = {
    fontSize: '16px',
    color: '#4b5563',
    margin: '0 0 20px 0'
};
const contactInfo = {
    marginTop: '16px'
};
const contactButton = {
    backgroundColor: '#ffffff',
    border: '2px solid #4f46e5',
    borderRadius: '6px',
    color: '#4f46e5',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '10px 20px',
    margin: '0 8px'
};
const footer = {
    textAlign: 'center',
    marginTop: '32px'
};
const footerText = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 8px 0'
};
const footerDisclaimer = {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '16px 0 0 0'
};
const link = {
    color: '#4f46e5',
    textDecoration: 'none'
};
