import { format } from "date-fns";

export const formatDate = (dateString: string) => {
  // Extract date portion only to avoid timezone issues
  const dateOnly = dateString.split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDuration = (duration: string) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  if (!match) return duration;
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  return `${hours}h ${minutes}m`;
};

export const formatTime = (datetime: string) => {
  // For datetime with time component, use as-is
  return format(new Date(datetime), "HH:mm");
};

export const formatDateF = (datetime: string) => {
  // Extract date portion only to avoid timezone issues
  const dateOnly = datetime.split("T")[0];
  const [year, month, day] = dateOnly.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return format(date, "MMM dd");
};

/**
 * Get currency symbol from currency code
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'EUR', 'GBP')
 * @returns Currency symbol (e.g., '$', '€', '£')
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    INR: "₹",
    AUD: "A$",
    CAD: "C$",
    CHF: "Fr",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    NZD: "NZ$",
    ZAR: "R",
    BRL: "R$",
    MXN: "Mex$",
    RUB: "₽",
    KRW: "₩",
    SGD: "S$",
    HKD: "HK$",
    TRY: "₺",
    PLN: "zł",
    THB: "฿",
    IDR: "Rp",
    MYR: "RM",
    PHP: "₱",
    CZK: "Kč",
    ILS: "₪",
    CLP: "$",
    ARS: "$",
    COP: "$",
    EGP: "E£",
    SAR: "﷼",
    AED: "د.إ",
    KWD: "د.ك",
    QAR: "﷼",
  };

  return currencySymbols[currencyCode.toUpperCase()] || currencyCode;
};

/**
 * Format price with currency symbol
 * @param price - Price amount
 * @param currencyCode - ISO 4217 currency code
 * @param position - Position of symbol ('before' or 'after')
 * @returns Formatted price string (e.g., '$356.69' or '356.69 €')
 */
export const formatPriceWithSymbol = (
  price: number | string,
  currencyCode: string,
  position: "before" | "after" = "before"
): string => {
  if (price === "N/A" || price === null || price === undefined) {
    return "N/A";
  }

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return "N/A";
  }

  const symbol = getCurrencySymbol(currencyCode);
  const formattedPrice = numericPrice.toFixed(2);

  // Currencies that typically have symbol after the amount
  const symbolAfterCurrencies = ["EUR", "SEK", "NOK", "DKK", "CZK", "PLN"];

  const shouldPlaceAfter =
    position === "after" ||
    (position === "before" &&
      symbolAfterCurrencies.includes(currencyCode.toUpperCase()));

  return shouldPlaceAfter
    ? `${formattedPrice} ${symbol}`
    : `${symbol}${formattedPrice}`;
};

/**
 * Convert currency code to locale for number formatting
 * @param currencyCode - ISO 4217 currency code
 * @returns Locale string (e.g., 'en-US', 'de-DE')
 */
export const getCurrencyLocale = (currencyCode: string): string => {
  const localeMap: Record<string, string> = {
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
    CNY: "zh-CN",
    INR: "en-IN",
    AUD: "en-AU",
    CAD: "en-CA",
    CHF: "de-CH",
    SEK: "sv-SE",
    NOK: "no-NO",
    DKK: "da-DK",
    NZD: "en-NZ",
    ZAR: "en-ZA",
    BRL: "pt-BR",
    MXN: "es-MX",
    RUB: "ru-RU",
    KRW: "ko-KR",
    SGD: "en-SG",
    HKD: "zh-HK",
    TRY: "tr-TR",
    PLN: "pl-PL",
    THB: "th-TH",
    IDR: "id-ID",
    MYR: "ms-MY",
    PHP: "en-PH",
    CZK: "cs-CZ",
  };

  return localeMap[currencyCode.toUpperCase()] || "en-US";
};

/**
 * Format price using Intl.NumberFormat with proper locale and currency
 * @param price - Price amount
 * @param currencyCode - ISO 4217 currency code
 * @returns Formatted price string with proper locale formatting
 */
export const formatPriceLocalized = (
  price: number | string,
  currencyCode: string
): string => {
  if (price === "N/A" || price === null || price === undefined) {
    return "N/A";
  }

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return "N/A";
  }

  const locale = getCurrencyLocale(currencyCode);

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  } catch (error) {
    // Fallback if currency code is not supported
    return formatPriceWithSymbol(numericPrice, currencyCode);
  }
};

export const generateDownloadLink = async (
  blob: any,
  fileName: string,
  fileNamePreText?: string
) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${
    fileNamePreText !== undefined ? fileNamePreText + "-" : ""
  }${fileName.toLowerCase().replaceAll(" ", "-")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
