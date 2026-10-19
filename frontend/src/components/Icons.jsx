const Svg = ({ children, size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const HomeIcon = (props) => (
  <Svg {...props}>
    <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </Svg>
);

export const MarketsIcon = (props) => (
  <Svg {...props}>
    <path d="M4 10h16l-1 10H5L4 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8"/>
  </Svg>
);

export const ShopIcon = (props) => (
  <Svg {...props}>
    <rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.8"/>
  </Svg>
);

export const AdviceIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3c4.5 5 7 9 7 12a7 7 0 1 1-14 0c0-3 2.5-7 7-12z" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 14v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const AccountIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M5 19c1.6-3.2 4-4.8 7-4.8S17.4 15.8 19 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const PlusIcon = (props) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

export const SearchIcon = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const PinIcon = (props) => (
  <Svg {...props}>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="12" cy="10" r="2.2" fill="currentColor"/>
  </Svg>
);

export const BellIcon = (props) => (
  <Svg {...props}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8"/>
  </Svg>
);

export const BackIcon = (props) => (
  <Svg {...props}>
    <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const ShareIcon = (props) => (
  <Svg {...props}>
    <circle cx="18" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="18" cy="19" r="2.4" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M8.2 11.1 15.8 6.3M8.2 12.9l7.6 5" stroke="currentColor" strokeWidth="1.6"/>
  </Svg>
);

export const HeartIcon = (props) => (
  <Svg {...props}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </Svg>
);

export const LeafIcon = (props) => (
  <Svg {...props}>
    <path d="M5 19C8 8 16 4 21 4c0 5-4 13-16 15" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 15c3-2 6-6 8-10" stroke="currentColor" strokeWidth="1.8"/>
  </Svg>
);

export const ScaleIcon = (props) => (
  <Svg {...props}>
    <path d="M12 4v16M4 8h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M7 8 4 14h6L7 8zm10 0-3 6h6l-3-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </Svg>
);

export const CalendarIcon = (props) => (
  <Svg {...props}>
    <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8 4v4M16 4v4M4 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const CallIcon = (props) => (
  <Svg {...props}>
    <path d="M6 4h4l2 5-2 2a12 12 0 0 0 5 5l2-2 5 2v4c0 1-1 2-2 2C10 22 2 14 2 6c0-1 1-2 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </Svg>
);

export const WhatsAppIcon = (props) => (
  <Svg {...props}>
    <path d="M5 19l1.4-4A8 8 0 1 1 12 20a8 8 0 0 1-3.6-.8L5 19z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 10c.4 2 2.2 3.8 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const WeatherSunIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="4" fill="#f5c542"/>
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" stroke="#f5c542" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const WeatherRainIcon = (props) => (
  <Svg {...props}>
    <path d="M7 14h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.4 1.5A3.5 3.5 0 0 0 7 14z" fill="#d7ecf8" stroke="#fff" strokeWidth="1"/>
    <path d="M9 17v3M12 16v4M15 17v3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const WeatherCloudIcon = (props) => (
  <Svg {...props}>
    <path d="M7 16h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.4 1.5A3.5 3.5 0 0 0 7 16z" fill="#e8f4fb" stroke="#fff" strokeWidth="1"/>
  </Svg>
);

export const AlertWeatherIcon = (props) => (
  <Svg {...props}>
    <path d="M4 16h16l-2-6H6L4 16z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M8 16v3M16 16v3M12 4v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const AlertPestIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M6 8l3 2M18 8l-3 2M6 16l3-2M18 16l-3-2M12 6V3M12 21v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const AlertMarketIcon = (props) => (
  <Svg {...props}>
    <path d="M4 16l5-5 3 3 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 6h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const AlertUrgentIcon = (props) => (
  <Svg {...props}>
    <path d="M12 4 3 20h18L12 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M12 10v5M12 17v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const CheckIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12.5 9.5 17 19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export function weatherIconFor(code, rainMm = 0) {
  if (rainMm >= 2 || [51, 53, 55, 61, 63, 65, 80, 81, 95, 96].includes(code)) return WeatherRainIcon;
  if ([2, 3, 45, 48].includes(code)) return WeatherCloudIcon;
  return WeatherSunIcon;
}
