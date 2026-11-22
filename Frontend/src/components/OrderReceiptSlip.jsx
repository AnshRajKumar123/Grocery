import React from "react";
import "../styles/ReceiptSlip.css";
import { Check, Ticket, Printer, X } from "lucide-react";

export default function OrderReceiptSlip({ order, onClose }) {
    if (!order) return null;

    return (
        <div className="receipt-modal-backdrop" onClick={onClose}>
            <div className="receipt-ejector-wrapper" onClick={(e) => e.stopPropagation()}>
                {/* 1. Hardware Gold Head Ejector Bar[cite: 15] */}
                <div className="printer-hardware-head">
                    <div className="printer-slit-gap"></div>
                    <div className="printer-status-led" title="Printer Ready"></div>
                </div>

                {/* 2. Thermal Paper Ticket Body[cite: 15] */}
                <div className="receipt-paper-slip">
                    {/* Side Perforation Notches[cite: 15] */}
                    <div className="paper-cut-notch-left"></div>
                    <div className="paper-cut-notch-right"></div>
                    <div className="perforated-tear-line"></div>

                    {/* Logo Badge Icon */}
                    <div className="receipt-logo-coin">
                        <Ticket size={24} />
                    </div>

                    {/* Headline (from screenshot)[cite: 15] */}
                    <div className="receipt-title-box">
                        <h3>Thank you!</h3>
                        <p>Your order receipt has been issued successfully</p>
                    </div>

                    {/* 2x2 Data Grid (from screenshot)[cite: 15] */}
                    <div className="receipt-meta-grid">
                        <div className="meta-field-cell">
                            <span className="meta-label-tag">ORDER ID</span>
                            <span className="meta-value-text">{order.id}</span>
                        </div>
                        <div className="meta-field-cell right">
                            <span className="meta-label-tag">AMOUNT</span>
                            <span className="meta-value-text amount-highlight">₹{order.totalAmount}</span>
                        </div>

                        <div className="meta-field-cell">
                            <span className="meta-label-tag">DATE & TIME</span>
                            <span className="meta-value-text">{order.dateFormatted}</span>
                        </div>
                        <div className="meta-field-cell right">
                            <span className="meta-label-tag">STATUS</span>
                            <span className="meta-status-pill">{order.status || "Confirmed"}</span>
                        </div>
                    </div>

                    {/* Payment Method Chip (Mastercard / UPI look)[cite: 15] */}
                    <div className="receipt-payment-strip">
                        <div className="payment-brand-disc">
                            <div className="disc-red"></div>
                            <div className="disc-yellow"></div>
                        </div>
                        <div className="payer-info-text">
                            <strong>{order.customerName}</strong>
                            <small>{order.paymentMethod} •••• {order.paymentLast4 || "8237"}</small>
                        </div>
                    </div>

                    {/* Realistic SVG Barcode[cite: 15] */}
                    <div className="receipt-barcode-box">
                        <svg className="barcode-svg-canvas" viewBox="0 0 200 45" preserveAspectRatio="none">
                            <rect x="0" y="0" width="3" height="45" fill="#0f172a" />
                            <rect x="6" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="11" y="0" width="5" height="45" fill="#0f172a" />
                            <rect x="19" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="24" y="0" width="4" height="45" fill="#0f172a" />
                            <rect x="31" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="36" y="0" width="6" height="45" fill="#0f172a" />
                            <rect x="46" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="52" y="0" width="3" height="45" fill="#0f172a" />
                            <rect x="58" y="0" width="5" height="45" fill="#0f172a" />
                            <rect x="66" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="71" y="0" width="4" height="45" fill="#0f172a" />
                            <rect x="79" y="0" width="3" height="45" fill="#0f172a" />
                            <rect x="85" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="90" y="0" width="6" height="45" fill="#0f172a" />
                            <rect x="99" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="104" y="0" width="4" height="45" fill="#0f172a" />
                            <rect x="111" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="116" y="0" width="5" height="45" fill="#0f172a" />
                            <rect x="124" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="129" y="0" width="4" height="45" fill="#0f172a" />
                            <rect x="136" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="141" y="0" width="6" height="45" fill="#0f172a" />
                            <rect x="151" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="156" y="0" width="3" height="45" fill="#0f172a" />
                            <rect x="162" y="0" width="5" height="45" fill="#0f172a" />
                            <rect x="171" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="176" y="0" width="4" height="45" fill="#0f172a" />
                            <rect x="184" y="0" width="3" height="45" fill="#0f172a" />
                            <rect x="190" y="0" width="2" height="45" fill="#0f172a" />
                            <rect x="195" y="0" width="5" height="45" fill="#0f172a" />
                        </svg>
                        <span className="barcode-numeric-code">2 8937261 273610</span>
                    </div>

                    {/* Action Toolbar */}
                    <div className="receipt-actions-deck">
                        <button
                            type="button"
                            className="btn-receipt-print"
                            onClick={() => window.print()}
                        >
                            <Printer size={15} /> Print Slip
                        </button>
                        <button
                            type="button"
                            className="btn-receipt-close"
                            onClick={onClose}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}