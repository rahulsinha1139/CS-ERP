"use strict";
/**
 * Professional Invoice Email Template for Company Secretary Practices
 * Built with React Email for perfect rendering across all email clients
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceEmail = void 0;
const components_1 = require("@react-email/components");
const react_1 = __importDefault(require("react"));
const InvoiceEmail = ({ invoiceNumber = "INV-2024-001", customerName = "Sunrise Industries Ltd", companyName = "Sharma & Associates", amount = 25000, dueDate = "30th September 2024", invoiceUrl = "#", paymentUrl = "#", companyLogo, companyEmail = "contact@sharmaassociates.com", companyPhone = "+91 98765 43210", services = [
    { description: "ROC Annual Filing", amount: 15000 },
    { description: "Board Resolution Preparation", amount: 10000 }
] }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };
    return (react_1.default.createElement(components_1.Html, null,
        react_1.default.createElement(components_1.Head, null),
        react_1.default.createElement(components_1.Preview, null,
            "Invoice ",
            invoiceNumber,
            " from ",
            companyName,
            " - Due ",
            dueDate),
        react_1.default.createElement(components_1.Body, { style: main },
            react_1.default.createElement(components_1.Container, { style: container },
                react_1.default.createElement(components_1.Section, { style: header },
                    react_1.default.createElement(components_1.Row, null,
                        react_1.default.createElement(components_1.Column, null,
                            companyLogo && (react_1.default.createElement(components_1.Img, { src: companyLogo, width: "120", height: "40", alt: companyName, style: logo })),
                            react_1.default.createElement(components_1.Heading, { style: companyNameHeading }, companyName),
                            react_1.default.createElement(components_1.Text, { style: companySubtitle }, "Company Secretary & Legal Consultants")),
                        react_1.default.createElement(components_1.Column, { align: "right" },
                            react_1.default.createElement(components_1.Text, { style: invoiceTitle }, "INVOICE"),
                            react_1.default.createElement(components_1.Text, { style: invoiceNumberStyle }, invoiceNumber)))),
                react_1.default.createElement(components_1.Hr, { style: hr }),
                react_1.default.createElement(components_1.Section, { style: section },
                    react_1.default.createElement(components_1.Text, { style: greeting },
                        "Dear ",
                        customerName,
                        ","),
                    react_1.default.createElement(components_1.Text, { style: paragraph }, "Thank you for choosing our professional company secretary services. Please find your invoice details below:")),
                react_1.default.createElement(components_1.Section, { style: invoiceCard },
                    react_1.default.createElement(components_1.Row, { style: invoiceHeader },
                        react_1.default.createElement(components_1.Column, null,
                            react_1.default.createElement(components_1.Text, { style: invoiceHeaderText }, "Invoice Amount"),
                            react_1.default.createElement(components_1.Text, { style: amountStyle }, formatCurrency(amount))),
                        react_1.default.createElement(components_1.Column, { align: "right" },
                            react_1.default.createElement(components_1.Text, { style: invoiceHeaderText }, "Due Date"),
                            react_1.default.createElement(components_1.Text, { style: dueDateStyle }, dueDate))),
                    react_1.default.createElement(components_1.Section, { style: servicesSection },
                        react_1.default.createElement(components_1.Text, { style: servicesTitle }, "Services Provided"),
                        services.map((service, index) => (react_1.default.createElement(components_1.Row, { key: index, style: serviceRow },
                            react_1.default.createElement(components_1.Column, null,
                                react_1.default.createElement(components_1.Text, { style: serviceDescription }, service.description)),
                            react_1.default.createElement(components_1.Column, { align: "right" },
                                react_1.default.createElement(components_1.Text, { style: serviceAmount }, formatCurrency(service.amount))))))),
                    react_1.default.createElement(components_1.Hr, { style: serviceDivider }),
                    react_1.default.createElement(components_1.Row, { style: totalRow },
                        react_1.default.createElement(components_1.Column, null,
                            react_1.default.createElement(components_1.Text, { style: totalLabel }, "Total Amount")),
                        react_1.default.createElement(components_1.Column, { align: "right" },
                            react_1.default.createElement(components_1.Text, { style: totalAmount }, formatCurrency(amount))))),
                react_1.default.createElement(components_1.Section, { style: buttonSection },
                    react_1.default.createElement(components_1.Row, null,
                        react_1.default.createElement(components_1.Column, { align: "center" },
                            react_1.default.createElement(components_1.Button, { style: primaryButton, href: paymentUrl }, "Pay Now")),
                        react_1.default.createElement(components_1.Column, { align: "center" },
                            react_1.default.createElement(components_1.Button, { style: secondaryButton, href: invoiceUrl }, "View Invoice")))),
                react_1.default.createElement(components_1.Section, { style: section },
                    react_1.default.createElement(components_1.Text, { style: sectionTitle }, "Payment Instructions"),
                    react_1.default.createElement(components_1.Text, { style: paragraph },
                        "\u2022 ",
                        react_1.default.createElement("strong", null, "Online Payment:"),
                        " Click \"Pay Now\" above for secure online payment"),
                    react_1.default.createElement(components_1.Text, { style: paragraph },
                        "\u2022 ",
                        react_1.default.createElement("strong", null, "Bank Transfer:"),
                        " Use invoice number as reference"),
                    react_1.default.createElement(components_1.Text, { style: paragraph },
                        "\u2022 ",
                        react_1.default.createElement("strong", null, "Questions?"),
                        " Reply to this email or call ",
                        companyPhone)),
                react_1.default.createElement(components_1.Section, { style: noteSection },
                    react_1.default.createElement(components_1.Text, { style: noteText },
                        react_1.default.createElement("strong", null, "Note:"),
                        " This invoice includes all applicable taxes as per Indian GST regulations. Payment terms are net 30 days from invoice date.")),
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
                    react_1.default.createElement(components_1.Text, { style: footerDisclaimer }, "This is a computer-generated invoice. Thank you for your business."))))));
};
exports.InvoiceEmail = InvoiceEmail;
exports.default = exports.InvoiceEmail;
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
const invoiceTitle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0'
};
const invoiceNumberStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#4f46e5',
    margin: '8px 0 0 0'
};
const hr = {
    borderColor: '#e5e7eb',
    margin: '24px 0'
};
const section = {
    marginBottom: '32px'
};
const greeting = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 16px 0'
};
const paragraph = {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#4b5563',
    margin: '0 0 16px 0'
};
const invoiceCard = {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px'
};
const invoiceHeader = {
    marginBottom: '24px'
};
const invoiceHeaderText = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};
const amountStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#059669',
    margin: '0'
};
const dueDateStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#dc2626',
    margin: '0'
};
const servicesSection = {
    marginBottom: '24px'
};
const servicesTitle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 16px 0'
};
const serviceRow = {
    marginBottom: '8px'
};
const serviceDescription = {
    fontSize: '14px',
    color: '#4b5563',
    margin: '0'
};
const serviceAmount = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0'
};
const serviceDivider = {
    borderColor: '#d1d5db',
    margin: '16px 0'
};
const totalRow = {
    backgroundColor: '#ffffff',
    padding: '16px 0 0 0'
};
const totalLabel = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0'
};
const totalAmount = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0'
};
const buttonSection = {
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
    padding: '12px 24px',
    margin: '0 8px'
};
const secondaryButton = {
    backgroundColor: '#ffffff',
    border: '2px solid #4f46e5',
    borderRadius: '6px',
    color: '#4f46e5',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '10px 24px',
    margin: '0 8px'
};
const sectionTitle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 16px 0'
};
const noteSection = {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '32px'
};
const noteText = {
    fontSize: '14px',
    color: '#92400e',
    margin: '0'
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
