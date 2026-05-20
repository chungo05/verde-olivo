"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfettiOverlay from "@/components/admin/ConfettiOverlay";

const TIME_SLOTS = [
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:30 AM", available: true },
  { time: "01:00 PM", available: false },
  { time: "02:00 PM", available: true },
  { time: "03:30 PM", available: true },
];

const MONTH_KEYS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
] as const;

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

interface PropertyData {
  id: string;
  slug?: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  image_url: string | string[];
  is_rent?: boolean;
  isRent?: boolean;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  property: PropertyData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  locale: string;
  slug: string;
}

export default function ScheduleVisitClient({ property, dict, locale, slug }: Props) {
  const router = useRouter();
  const sv = dict.scheduleVisitPage;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-based grid: 0=Mon … 6=Sun
  const startBlank = (firstDayOfMonth.getDay() + 6) % 7;

  const isPrevDisabled = () => {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth();
  };

  const handlePrevMonth = () => {
    if (isPrevDisabled()) return;
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const isDayDisabled = (day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDaySelected = (day: number) =>
    selectedDate !== null &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month &&
    selectedDate.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  const handleDayClick = (day: number) => {
    if (isDayDisabled(day)) return;
    setSelectedDate(new Date(year, month, day));
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    setShowConfetti(true);
    setShowSuccess(true);
    setTimeout(() => router.push(`/${locale}`), 3500);
  };

  const handleConfettiDone = useCallback(() => setShowConfetti(false), []);

  const images = Array.isArray(property.image_url)
    ? property.image_url
    : [property.image_url].filter(Boolean);
  const mainImage = images[0] ?? "";
  const isRent = property.is_rent ?? property.isRent;
  const monthLabel = `${sv.months[MONTH_KEYS[month]]} ${year}`;

  // Build calendar cells: leading blanks + days + trailing blanks to fill last row
  const cells: (number | null)[] = [
    ...Array<null>(startBlank).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <main className="flex flex-col items-center py-8 px-4 md:px-8">
      <ConfettiOverlay active={showConfetti} onDone={handleConfettiDone} />

      {/* Success toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          showSuccess ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-mosque text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-[90vw]">
          <span className="material-icons text-2xl">check_circle</span>
          <div>
            <p className="font-semibold">{sv.successTitle}</p>
            <p className="text-sm text-white/80">{sv.successMessage}</p>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="w-full max-w-6xl mb-6">
        <Link
          href={`/${locale}/properties/${slug}`}
          className="flex items-center gap-2 group text-nordic-muted hover:text-mosque transition-colors w-fit"
        >
          <span className="material-icons text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="font-medium">{sv.backToProperty}</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg shadow-mosque/5 overflow-hidden flex flex-col md:flex-row border border-slate-100 mb-12">

        {/* Left: Property summary */}
        <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 lg:p-10 flex flex-col gap-6">

          {/* Property image */}
          <div className="relative overflow-hidden rounded-lg shadow-md aspect-[4/3] group">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <span className="material-icons text-slate-400 text-4xl">home</span>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-mosque">
              {isRent ? sv.forRent : sv.forSale}
            </div>
          </div>

          {/* Property details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-nordic-dark leading-tight">{property.title}</h2>
              <p className="text-slate-500 mt-1 flex items-center gap-1 text-sm">
                <span className="material-icons text-base">location_on</span>
                {property.location}
              </p>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-slate-200">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {dict.admin.properties.colPrice}
                </span>
                <span className="text-xl font-bold text-mosque">{property.price}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="flex flex-col items-center">
                  <span className="material-icons text-slate-400">bed</span>
                  <span className="text-xs font-medium">{property.beds} {dict.common.beds}</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col items-center">
                  <span className="material-icons text-slate-400">shower</span>
                  <span className="text-xs font-medium">{property.baths} {dict.common.baths}</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex flex-col items-center">
                  <span className="material-icons text-slate-400">square_foot</span>
                  <span className="text-xs font-medium">{property.area}</span>
                </div>
              </div>
            </div>

            {/* Agent */}
            <div className="flex items-center gap-3 pt-2">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w"
                  alt="Agent"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{sv.hostedBy}</p>
                <p className="text-nordic-dark font-semibold">Sarah Jenkins</p>
              </div>
              <button className="ml-auto p-2 text-mosque hover:bg-mosque/10 rounded-full transition-colors">
                <span className="material-icons">chat_bubble_outline</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Booking form */}
        <div className="w-full md:w-7/12 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nordic-dark mb-2">{sv.title}</h1>
            <p className="text-slate-500 mb-8">{sv.subtitle}</p>

            {/* Calendar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-nordic-dark uppercase tracking-wider">
                  {monthLabel}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={handlePrevMonth}
                    disabled={isPrevDisabled()}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-mosque transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="material-icons text-lg">chevron_left</span>
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 rounded-full hover:bg-slate-100 text-nordic-dark hover:text-mosque transition-colors"
                  >
                    <span className="material-icons text-lg">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
                {DAY_KEYS.map((day) => (
                  <div key={day} className="text-xs font-medium text-slate-400 py-2">
                    {sv.days[day]}
                  </div>
                ))}
                {cells.map((day, idx) => {
                  if (day === null) return <div key={`blank-${idx}`} />;
                  const disabled = isDayDisabled(day);
                  const selected = isDaySelected(day);
                  const todayDay = isToday(day);
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      disabled={disabled}
                      className={[
                        "relative py-2 rounded-lg text-sm transition-colors",
                        selected
                          ? "bg-mosque text-white font-semibold shadow-lg shadow-mosque/30 scale-105"
                          : disabled
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-100 cursor-pointer",
                      ].join(" ")}
                    >
                      {day}
                      {todayDay && !selected && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-mosque rounded-full" />
                      )}
                      {selected && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-nordic-dark uppercase tracking-wider mb-4">
                {sv.availableTimes}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map(({ time, available }) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => available && setSelectedTime(time)}
                      disabled={!available}
                      className={[
                        "py-2 px-3 rounded-lg text-sm transition-all border",
                        isSelected
                          ? "bg-mosque/10 border-mosque text-mosque font-medium shadow-sm"
                          : available
                          ? "border-slate-200 text-slate-500 hover:border-mosque hover:text-mosque"
                          : "border-slate-200 text-slate-300 cursor-not-allowed opacity-50 line-through",
                      ].join(" ")}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <label
                className="block text-sm font-semibold text-nordic-dark uppercase tracking-wider mb-2"
                htmlFor="visit-message"
              >
                {sv.messageLabel}{" "}
                <span className="text-slate-400 font-normal normal-case ml-1">{sv.messageOptional}</span>
              </label>
              <textarea
                id="visit-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={sv.messagePlaceholder}
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 text-nordic-dark placeholder:text-slate-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-shadow resize-none text-sm p-3"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
            <Link
              href={`/${locale}/properties/${slug}`}
              className="text-slate-500 hover:text-nordic-dark font-medium px-4 py-2 text-sm transition-colors"
            >
              {sv.cancel}
            </Link>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="bg-mosque hover:bg-primary-hover text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-mosque/20 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              <span>{sv.confirmVisit}</span>
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
