import React, { useState } from 'react';
import mooLogo from './assets/moo.svg';
import BuffetForm from './components/BuffetForm';
import ReceiptSummary from './components/ReceiptSummary';

const INITIAL_FORM_STATE = {
  tableNo: '',
  customerName: '',
  adults: '',
  children: '',
  drinkType: 'refill', // 'refill' | 'bottle'
  waterBottles: '',
  sodaBottles: '',
  discountPercent: 0,
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState('');
  const [bill, setBill] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleDrinkTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      drinkType: type,
      waterBottles: type === 'refill' ? '' : prev.waterBottles,
      sodaBottles: type === 'refill' ? '' : prev.sodaBottles,
    }));
    if (error) setError('');
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    const adults = formData.adults === '' ? 0 : Number(formData.adults);
    const children = formData.children === '' ? 0 : Number(formData.children);

    if (
      adults < 0 ||
      children < 0 ||
      !Number.isInteger(adults) ||
      !Number.isInteger(children)
    ) {
      setError('กรุณาป้อนจำนวนผู้ใหญ่และเด็กเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป');
      setBill(null);
      return;
    }

    const totalPeople = adults + children;

    if (totalPeople <= 0) {
      setError('กรุณาป้อนจำนวนผู้ใหญ่ หรือจำนวนเด็กอย่างน้อย 1 คน');
      setBill(null);
      return;
    }

    const adultFoodCost = adults * 299;
    const childFoodCost = children * 89;
    const totalFoodCost = adultFoodCost + childFoodCost;

    const discountPercent = Number(formData.discountPercent) || 0;
    const discountAmount = (totalFoodCost * discountPercent) / 100;
    const netFoodCost = totalFoodCost - discountAmount;

    let drinkCost = 0;
    let drinkSummary = '';
    const drinkDetails = [];

    if (formData.drinkType === 'refill') {
      drinkCost = totalPeople * 29;
      drinkSummary = `รีฟิล ${totalPeople} คน × 29 บ.`;
    } else {
      const water =
        formData.waterBottles === '' ? 0 : Number(formData.waterBottles);
      const soda =
        formData.sodaBottles === '' ? 0 : Number(formData.sodaBottles);

      if (
        water < 0 ||
        soda < 0 ||
        !Number.isInteger(water) ||
        !Number.isInteger(soda)
      ) {
        setError('กรุณาป้อนจำนวนขวดเครื่องดื่มเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป');
        setBill(null);
        return;
      }

      const waterCost = water * 10;
      const sodaCost = soda * 25;
      drinkCost = waterCost + sodaCost;
      drinkSummary = 'แบบขวด';

      if (water > 0) {
        drinkDetails.push({
          label: `น้ำเปล่า (${water} ขวด × 10 บ.)`,
          cost: waterCost,
        });
      }
      if (soda > 0) {
        drinkDetails.push({
          label: `น้ำอัดลม (${soda} ขวด × 25 บ.)`,
          cost: sodaCost,
        });
      }
      if (water === 0 && soda === 0) {
        drinkSummary = 'แบบขวด (ไม่รับเครื่องดื่ม)';
      }
    }

    const grandTotal = netFoodCost + drinkCost;
    const perPerson = grandTotal / totalPeople;

    const now = new Date();
    const timestamp = now.toLocaleString('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    setError('');
    setBill({
      tableNo: formData.tableNo.trim(),
      customerName: formData.customerName.trim(),
      adults,
      children,
      totalPeople,
      adultFoodCost,
      childFoodCost,
      totalFoodCost,
      discountPercent,
      discountAmount,
      drinkCost,
      drinkSummary,
      drinkDetails,
      grandTotal,
      perPerson,
      timestamp,
    });
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setError('');
    setBill(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center bg-gray-100">
      <main className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
        <header className="text-center mb-5">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Buffet Calculator
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">คำนวณค่าอาหารบุฟเฟต์</p>
          
          <div className="flex flex-col items-center justify-center my-3 select-none">
            <img src={mooLogo} alt="Logo" className="w-16 h-16 object-contain drop-shadow-sm" />
            <span className="mt-1 text-sm font-bold text-orange-600">แซ่บโอชา</span>
            <span className="text-[11px] font-medium text-gray-500 -mt-1">หมูกระทะ</span>
          </div>
        </header>

        <BuffetForm
          formData={formData}
          error={error}
          onInputChange={handleInputChange}
          onDrinkTypeChange={handleDrinkTypeChange}
          onCalculate={handleCalculate}
          onReset={handleReset}
        />

        <ReceiptSummary bill={bill} />
      </main>
    </div>
  );
}