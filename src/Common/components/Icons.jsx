function Icon({ className = 'icon', children }) {
    return (<svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>);
}
export function PhoneIcon() {
    return (<Icon>
      <path fill="currentColor" d="M7.2 3.6h2.1c.4 0 .8.3.9.7l.8 2.6c.1.4 0 .8-.3 1.1L9.2 9.4a12.6 12.6 0 0 0 5.4 5.4l1.4-1.5c.3-.3.7-.4 1.1-.3l2.6.8c.4.1.7.5.7.9v2.1c0 .6-.4 1-1 1C11.8 17.8 6.2 12.2 6.2 4.6c0-.6.4-1 1-1z"/>
    </Icon>);
}
export function MailIcon() {
    return (<Icon>
      <path fill="currentColor" d="M3.5 6.5A1.5 1.5 0 0 1 5 5h14a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-11zm1.6.5 6.9 4.6L18.9 7H5.1zm13.4 10.5V8.7l-6.2 4.1a.8.8 0 0 1-.8 0L5.5 8.7V17.5h13z"/>
    </Icon>);
}
export function EyeIcon() {
    return (<Icon>
      <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M2.5 12S6.2 6.5 12 6.5 21.5 12 21.5 12 17.8 17.5 12 17.5 2.5 12 2.5 12z"/>
      <circle cx="12" cy="12" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8"/>
    </Icon>);
}
export function EyeOffIcon() {
    return (<Icon>
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 5l16 14"/>
      <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M9.2 7.2A8.8 8.8 0 0 1 12 6.5c5.8 0 9.5 5.5 9.5 5.5a16 16 0 0 1-3.2 3.6M6.1 8.4C3.9 10 2.5 12 2.5 12S6.2 17.5 12 17.5c1.1 0 2.1-.2 3-.5"/>
    </Icon>);
}
export function MenuIcon() {
    return (<Icon>
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16"/>
    </Icon>);
}
export function CloseIcon() {
    return (<Icon>
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M6 6l12 12M18 6L6 18"/>
    </Icon>);
}
export function ChevronIcon({ expanded }) {
    return (<Icon className={expanded ? 'icon chevron is-open' : 'icon chevron'}>
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M8 10l4 4 4-4"/>
    </Icon>);
}
function StrokeIcon({ children }) {
    return (<Icon>
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </Icon>);
}
export function DashboardIcon() {
    return (<StrokeIcon>
      <rect x="4" y="4" width="7" height="7" rx="1.2"/>
      <rect x="13" y="4" width="7" height="7" rx="1.2"/>
      <rect x="4" y="13" width="7" height="7" rx="1.2"/>
      <rect x="13" y="13" width="7" height="7" rx="1.2"/>
    </StrokeIcon>);
}
export function FinanceIcon() {
    return (<StrokeIcon>
      <path d="M5 7.5h14v11H5z"/>
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5"/>
      <path d="M5 12h14"/>
    </StrokeIcon>);
}
export function AccountsIcon() {
    return (<StrokeIcon>
      <path d="M5 6h14M5 12h14M5 18h9"/>
    </StrokeIcon>);
}
export function LedgerIcon() {
    return (<StrokeIcon>
      <path d="M7 4.5h8.5L19 8v11.5H7z"/>
      <path d="M15 4.5V8h4M9.5 12h6M9.5 15.5h6"/>
    </StrokeIcon>);
}
export function GroupIcon() {
    return (<StrokeIcon>
      <rect x="4" y="5" width="7" height="6" rx="1"/>
      <rect x="13" y="5" width="7" height="6" rx="1"/>
      <rect x="8.5" y="13" width="7" height="6" rx="1"/>
    </StrokeIcon>);
}
export function ReceiptIcon() {
    return (<StrokeIcon>
      <path d="M7 4h10v16l-2-1.2L13 20l-2-1.2L9 20l-2-1.2V4z"/>
      <path d="M9.5 9h5M9.5 12.5h5"/>
    </StrokeIcon>);
}
export function PaymentIcon() {
    return (<StrokeIcon>
      <rect x="3.5" y="6" width="17" height="12" rx="1.5"/>
      <path d="M3.5 10h17"/>
    </StrokeIcon>);
}
export function JournalIcon() {
    return (<StrokeIcon>
      <path d="M8 5h10v14H8z"/>
      <path d="M6 7.5h2M6 12h2M6 16.5h2"/>
    </StrokeIcon>);
}
export function ReportsIcon() {
    return (<StrokeIcon>
      <path d="M5 19V9M10 19V5M15 19v-6M20 19V8"/>
    </StrokeIcon>);
}
export function SettingsIcon() {
    return (<StrokeIcon>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.7 6.7l1.4 1.4M15.9 15.9l1.4 1.4M17.3 6.7l-1.4 1.4M8.1 15.9l-1.4 1.4"/>
    </StrokeIcon>);
}
export function SearchIcon() {
    return (<StrokeIcon>
      <circle cx="11" cy="11" r="5.5"/>
      <path d="M15.5 15.5L20 20"/>
    </StrokeIcon>);
}
export function BellIcon() {
    return (<StrokeIcon>
      <path d="M6.5 16.5h11l-1.2-2V10a4.3 4.3 0 0 0-8.6 0v4.5z"/>
      <path d="M10 18.2a2 2 0 0 0 4 0"/>
    </StrokeIcon>);
}
export function SunIcon() {
    return (<StrokeIcon>
      <circle cx="12" cy="12" r="3.2"/>
      <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.8 6.8l1.4 1.4M15.8 15.8l1.4 1.4M17.2 6.8l-1.4 1.4M8.2 15.8l-1.4 1.4"/>
    </StrokeIcon>);
}
export function MoonIcon() {
    return (<StrokeIcon>
      <path d="M15.5 4.8A7.2 7.2 0 1 0 19.2 15 5.6 5.6 0 0 1 15.5 4.8z"/>
    </StrokeIcon>);
}
export function MonitorIcon() {
    return (<StrokeIcon>
      <rect x="4" y="5" width="16" height="11" rx="1.4"/>
      <path d="M9 19.5h6M12 16v3.5"/>
    </StrokeIcon>);
}
export const navigationIcons = {
    dashboard: DashboardIcon,
    finance: FinanceIcon,
    accounts: AccountsIcon,
    ledger: LedgerIcon,
    group: GroupIcon,
    receipt: ReceiptIcon,
    payment: PaymentIcon,
    journal: JournalIcon,
    reports: ReportsIcon,
    settings: SettingsIcon,
};
