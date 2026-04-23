'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type IconProps = { active: boolean };

const HomeIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
    {active ? <path d="M3 11l9-8 9 8M5 10v10h14V10M10 16h4" fill="currentColor"/> : <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>}
  </svg>
);

const LogIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" fill={active ? 'currentColor' : 'none'}/>
    <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ProgressIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 20h18" stroke={active ? 'currentColor' : 'currentColor'} strokeWidth={active ? 2.5 : 1.5}/>
    <path d="M6 16V10M11 16V6M16 16v-8M21 16v-4" stroke={active ? 'currentColor' : 'currentColor'} strokeWidth={active ? 2.5 : 1.5}/>
  </svg>
);

const LibraryIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h4v16H4z" fill={active ? 'currentColor' : 'none'}/>
    <path d="M10 4h4v16h-4z" fill={active ? 'currentColor' : 'none'}/>
    <path d="M16 5l4 14" stroke={active ? 'currentColor' : 'currentColor'} strokeWidth={active ? 2.5 : 1.5}/>
  </svg>
);

const SettingsIcon = ({ active }: IconProps) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" fill={active ? 'currentColor' : 'none'}/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const navItems = [
  { href: '/', label: 'Today', Icon: HomeIcon },
  { href: '/log', label: 'Log', Icon: LogIcon },
  { href: '/progress', label: 'Progress', Icon: ProgressIcon },
  { href: '/exercises', label: 'Library', Icon: LibraryIcon },
  { href: '/settings', label: 'Settings', Icon: SettingsIcon },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t"
      style={{ background: 'rgba(246,243,236,0.95)', borderColor: 'var(--hairline)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center w-full h-full gap-1.5 rounded-xl transition-colors relative"
              style={{ color: isActive ? 'var(--accent)' : 'var(--muted)' }}
            >
              {isActive && (
                <div className="absolute w-12 h-12 rounded-full opacity-10" style={{ backgroundColor: 'var(--accent)' }} />
              )}
              <Icon active={isActive} />
              <span className="text-[10px] tracking-[0.1em] uppercase font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
