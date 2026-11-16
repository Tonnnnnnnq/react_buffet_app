import React from 'react';

export default function BuffetForm({
  formData,
  error,
  onInputChange,
  onDrinkTypeChange,
  onCalculate,
  onReset,
}) {
  const isRefill = formData.drinkType === 'refill';

  return (
    <form onSubmit={onCalculate} noValidate className="space-y-4">
      {/* กล่องแจ้งเตือนเมื่อ Validate ไม่ผ่าน */}
      {error && (
        <div
          role="alert"
          className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
        >
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* เพิ่มช่องกรอก: เลขที่โต๊ะ / ชื่อลูกค้า (ไม่บังคับ) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="tableNo"
            className="block text-xs font-medium text-gray-600 mb-1"
          >
            เลขที่โต๊ะ (ถ้ามี)
          </label>
          <input
            id="tableNo"
            type="text"
            name="tableNo"
            placeholder="เช่น โต๊ะ 05"
            value={formData.tableNo}
            onChange={onInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div>
          <label
            htmlFor="customerName"
            className="block text-xs font-medium text-gray-600 mb-1"
          >
            ชื่อลูกค้า (ถ้ามี)
          </label>
          <input
            id="customerName"
            type="text"
            name="customerName"
            placeholder="เช่น คุณสมชาย"
            value={formData.customerName}
            onChange={onInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* จำนวนผู้ใหญ่ */}
      <div>
        <label
          htmlFor="adults"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          จำนวนผู้ใหญ่ (คนละ 299 บาท)
        </label>
        <input
          id="adults"
          type="number"
          name="adults"
          min="0"
          step="1"
          placeholder=""
          value={formData.adults}
          onChange={onInputChange}
          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* จำนวนเด็ก */}
      <div>
        <label
          htmlFor="children"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          จำนวนเด็ก (คนละ 89 บาท)
        </label>
        <input
          id="children"
          type="number"
          name="children"
          min="0"
          step="1"
          placeholder=""
          value={formData.children}
          onChange={onInputChange}
          className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* เครื่องดื่ม */}
      <fieldset className="border border-gray-200 rounded-xl p-4 space-y-3">
        <legend className="text-sm font-medium text-gray-700 px-1.5">
          เครื่องดื่ม
        </legend>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="radio"
            name="drinkType"
            value="refill"
            checked={isRefill}
            onChange={() => onDrinkTypeChange('refill')}
            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-800">
            น้ำรีฟิล คนละ 29 บาท (ผู้ใหญ่และเด็ก)
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="radio"
            name="drinkType"
            value="bottle"
            checked={!isRefill}
            onChange={() => onDrinkTypeChange('bottle')}
            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-800">
            เครื่องดื่มแบบขวด
          </span>
        </label>

        <div className="space-y-3 pt-1">
          <div>
            <label
              htmlFor="waterBottles"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              น้ำเปล่า (ขวดละ 10 บาท)
            </label>
            <input
              id="waterBottles"
              type="number"
              name="waterBottles"
              min="0"
              step="1"
              disabled={isRefill}
              value={formData.waterBottles}
              onChange={onInputChange}
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
            />
          </div>

          <div>
            <label
              htmlFor="sodaBottles"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              น้ำอัดลม (ขวดละ 25 บาท)
            </label>
            <input
              id="sodaBottles"
              type="number"
              name="sodaBottles"
              min="0"
              step="1"
              disabled={isRefill}
              value={formData.sodaBottles}
              onChange={onInputChange}
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
            />
          </div>
        </div>
      </fieldset>

      {/* บัตรส่วนลด */}
      <div>
        <label
          htmlFor="discountPercent"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          บัตรส่วนลด
        </label>
        <select
          id="discountPercent"
          name="discountPercent"
          value={formData.discountPercent}
          onChange={onInputChange}
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
        >
          <option value={0}>ไม่มีส่วนลด</option>
          <option value={10}>ส่วนลด 10%</option>
          <option value={15}>ส่วนลด 15%</option>
          <option value={20}>ส่วนลด 20%</option>
        </select>
        <p className="text-xs text-gray-500 mt-1.5">
          ลดเฉพาะค่าอาหารทั้งหมด ไม่รวมเครื่องดื่ม
        </p>
      </div>

      {/* ปุ่มคำนวณ & รีเซ็ต */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-medium rounded-lg shadow-sm transition cursor-pointer"
        >
          คำนวณ
        </button>
        <button
          type="button"
          onClick={onReset}
          className="w-full py-2.5 px-4 bg-red-500 hover:bg-red-600 active:scale-[0.99] text-white font-medium rounded-lg shadow-sm transition cursor-pointer"
        >
          รีเซ็ต
        </button>
      </div>
    </form>
  );
}