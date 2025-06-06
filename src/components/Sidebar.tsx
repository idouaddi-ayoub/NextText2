'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  TableCellsIcon, 
  ChartPieIcon, 
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Saisie des données', href: '/', icon: PencilSquareIcon },
  { name: 'Tableau des données', href: '/table', icon: TableCellsIcon },
  { name: 'Graphiques', href: '/graphs', icon: ChartPieIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const supabase = createBrowserClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const sidebarStyle = {
    height: '100%',
    transition: 'width 300ms ease-in-out',
    width: isCollapsed ? '4rem' : '18rem',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
  };

  const navStyle = {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '1rem',
  };

  return (
    <div style={sidebarStyle} className={`h-full ${isCollapsed ? 'w-16' : 'w-72'} transition-all duration-300 ease-in-out`}>
      <div style={{ height: '100%', backgroundColor: 'white', borderRight: '1px solid #e5e7eb' }}>
        <div style={headerStyle}>
          {!isCollapsed && (
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a365d' }}>
              ANAYASS
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              padding: '0.25rem',
              borderRadius: '0.375rem',
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {isCollapsed ? (
              <ChevronRightIcon style={{ height: '1.25rem', width: '1.25rem', color: '#6b7280' }} />
            ) : (
              <ChevronLeftIcon style={{ height: '1.25rem', width: '1.25rem', color: '#6b7280' }} />
            )}
          </button>
        </div>
        <nav style={navStyle}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, gap: '0.25rem' }}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name} style={{ marginBottom: '0.25rem' }}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      backgroundColor: isActive ? '#1a365d' : 'transparent',
                      color: isActive ? 'white' : '#374151',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon 
                      style={{
                        height: '1.25rem',
                        width: '1.25rem',
                        color: isActive ? 'white' : '#9ca3af',
                      }}
                    />
                    {!isCollapsed && (
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem 0.75rem',
              color: '#dc2626',
              borderRadius: '0.5rem',
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg
              style={{ width: '1.25rem', height: '1.25rem' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </div>
  );
} 