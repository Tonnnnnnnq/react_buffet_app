import React, { useState } from 'react';

export default function ReceiptSummary({ bill }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const formatMoney = (amount) =>
    amount.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // สร้างข้อความสรุปบิลสำหรับแชร์
  const generateBillText = () => {
    if (!bill) return '';
    return [
      `🧾 ใบเสร็จรับเงิน - แซ่บโอชา หมูกระทะ`,
      bill.tableNo || bill.customerName
        ? `📍 ${bill.tableNo ? bill.tableNo : ''} ${bill.customerName ? `(${bill.customerName})` : ''}`
        : null,
      `------------------------------------`,
      bill.adults > 0 ? `• บุฟเฟต์ผู้ใหญ่ (${bill.adults} x 299): ${formatMoney(bill.adultFoodCost)} บาท` : null,
      bill.children > 0 ? `• บุฟเฟต์เด็ก (${bill.children} x 89): ${formatMoney(bill.childFoodCost)} บาท` : null,
      `• รวมค่าอาหาร: ${formatMoney(bill.totalFoodCost)} บาท`,
      bill.discountPercent > 0 ? `• ส่วนลด (${bill.discountPercent}%): -${formatMoney(bill.discountAmount)} บาท` : null,
      `• ค่าเครื่องดื่ม (${bill.drinkSummary}): ${formatMoney(bill.drinkCost)} บาท`,
      `------------------------------------`,
      `💰 ยอดสุทธิ: ${formatMoney(bill.grandTotal)} บาท`,
      `👥 หารเฉลี่ย (${bill.totalPeople} คน): คนละ ${formatMoney(bill.perPerson)} บาท`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleCopyBill = async () => {
    if (!bill) return;
    try {
      await navigator.clipboard.writeText(generateBillText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShareLine = () => {
    const text = encodeURIComponent(generateBillText());
    window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
  };

  // URL สำหรับสร้าง QR Code จากข้อความสรุปบิล
  const qrCodeUrl = bill
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(generateBillText())}`
    : '';

  return (
    <div className="mt-5 space-y-4">
      {/* กล่องแสดงยอดชำระทั้งหมดตามต้นแบบ */}
      <div className="bg-indigo-50/90 border border-indigo-100 rounded-xl py-4 px-4 text-center">
        <span className="text-gray-700 font-medium text-base">
          ยอดชำระทั้งหมด:{' '}
        </span>
        <span className="text-xl font-bold text-indigo-600">
          {bill ? formatMoney(bill.grandTotal) : '0.00'}
        </span>
        <span className="text-gray-700 font-medium text-base"> บาท</span>
      </div>

      {/* รายละเอียดบิล */}
      {bill && (
        <div
          id="printable-receipt"
          className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-sm space-y-3"
        >
          {/* หัวบิล พร้อมแสดงโต๊ะ/ชื่อลูกค้าถ้ามี */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
            <div>
              <h2 className="font-semibold text-gray-800">
                🧾 รายละเอียดบิล
              </h2>
              {(bill.tableNo || bill.customerName) && (
                <p className="text-xs font-medium text-indigo-600 mt-0.5">
                  {bill.tableNo && `📍 ${bill.tableNo}`} {bill.customerName && `(${bill.customerName})`}
                </p>
              )}
              <p className="text-[11px] text-gray-400">{bill.timestamp}</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopyBill}
                className="text-xs px-2 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-medium transition cursor-pointer"
              >
                {copied ? '✓ คัดลอก' : '📋 คัดลอก'}
              </button>
              <button
                type="button"
                onClick={handleShareLine}
                className="text-xs px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 font-medium transition cursor-pointer"
              >
                💬 LINE
              </button>
              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="text-xs px-2 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-medium transition cursor-pointer"
              >
                {showQR ? '📱 ปิด QR' : '📷 QR'}
              </button>
            </div>
          </div>

          {/* แสดง QR Code สำหรับให้เพื่อนสแกนดูบิล */}
          {showQR && (
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-gray-200 animate-fadeIn">
              <img src={qrCodeUrl} alt="Bill QR Code" className="w-36 h-36 object-contain" />
              <span className="text-[11px] text-gray-500 mt-1">สแกนเพื่อดูรายละเอียดบิลและยอดหาร</span>
            </div>
          )}

          {/* รายการค่าใช้จ่าย */}
          <div className="space-y-1.5 text-gray-600">
            {bill.adults > 0 && (
              <div className="flex justify-between">
                <span>บุฟเฟต์ผู้ใหญ่ ({bill.adults} × 299 บ.)</span>
                <span>{formatMoney(bill.adultFoodCost)} บ.</span>
              </div>
            )}

            {bill.children > 0 && (
              <div className="flex justify-between">
                <span>บุฟเฟต์เด็ก ({bill.children} × 89 บ.)</span>
                <span>{formatMoney(bill.childFoodCost)} บ.</span>
              </div>
            )}

            <div className="flex justify-between font-medium text-gray-800 pt-1.5 border-t border-gray-200">
              <span>รวมค่าอาหาร</span>
              <span>{formatMoney(bill.totalFoodCost)} บ.</span>
            </div>

            {bill.discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>หักส่วนลดค่าอาหาร ({bill.discountPercent}%)</span>
                <span>-{formatMoney(bill.discountAmount)} บ.</span>
              </div>
            )}

            <div className="flex justify-between pt-1">
              <span>ค่าเครื่องดื่ม ({bill.drinkSummary})</span>
              <span>{formatMoney(bill.drinkCost)} บ.</span>
            </div>

            {bill.drinkDetails.length > 0 && (
              <div className="pl-3 space-y-0.5 text-xs text-gray-400">
                {bill.drinkDetails.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>- {item.label}</span>
                    <span>{formatMoney(item.cost)} บ.</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* สรุปยอดสุทธิและยอดหารเฉลี่ย */}
          <div className="pt-2.5 border-t border-gray-300 space-y-1">
            <div className="flex justify-between font-bold text-base text-gray-900">
              <span>ยอดสุทธิที่ต้องชำระ</span>
              <span className="text-indigo-600">
                {formatMoney(bill.grandTotal)} บาท
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>หารเฉลี่ย ({bill.totalPeople} คน)</span>
              <span className="font-medium text-gray-700">
                คนละ {formatMoney(bill.perPerson)} บาท
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}