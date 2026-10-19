import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { NAV_PAGES } from '../../config/navigation';
import { cn } from '../../utils/cn';
import { BrandMatrixIcon } from '../common/BrandMatrixIcon';

interface SidebarProps {
  username: string;
  role: string;
  workspace: string;
  onLogout: () => void;
}

export const Sidebar = ({ username, role, workspace, onLogout }: SidebarProps) => (
  <>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#172B1F] bg-[#0D1912] text-white lg:flex">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-[#172B1F]/60">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14231A] ring-1 ring-[#1E3326] shadow-sm">
          <BrandMatrixIcon className="h-5 w-5" dotClassName="rounded-[2.5px] bg-[#D2F865]" />
        </span>
        <div className="leading-tight">
          <p className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            Portfos
          </p>
          <p className="text-[11px] font-medium text-[#8FA396]">Tenant Console</p>
        </div>
      </div>

      <nav aria-label="Pages" className="flex-1 overflow-y-auto px-4 py-5">
        <p className="px-3 pb-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#7E9587]">Menu</p>
        <ul className="space-y-1.5">
          {NAV_PAGES.map(({ path, label, icon: Icon, comingSoon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  cn(
                    'group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[#D2F865] text-[#0D1912] font-semibold shadow-md shadow-[#D2F865]/20'
                      : 'text-[#8FA396] hover:bg-[#14231A] hover:text-[#D2F865]'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('h-[18px] w-[18px] transition-transform duration-200', !isActive && 'group-hover:scale-110 text-inherit')} />
                    <span className="flex-1">{label}</span>
                    {comingSoon && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                          isActive ? 'bg-[#0D1912]/15 text-[#0D1912]' : 'bg-[#14231A] text-[#7E9587] border border-[#1E3326]'
                        )}
                      >
                        Soon
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[#172B1F] p-4 bg-[#0A130E]/60">
        <div className="flex items-center gap-3 rounded-xl p-2 bg-[#14231A]/50 border border-[#1E3326]/60">
          <div className="relative">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1C3024] text-xs font-bold uppercase tracking-wider text-[#D2F865] ring-1 ring-[#284232]">
              {username.slice(0, 2).toUpperCase() || 'PC'}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#22C55E] ring-2 ring-[#0D1912]" title="Active" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-white">{username}</p>
            <p className="truncate text-xs text-[#8FA396]">
              {workspace} · {role.replace('_', ' ').toLowerCase() || 'user'}
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out"
            title="Log out"
            className="rounded-lg p-2 text-[#7E9587] transition hover:bg-[#1E3326] hover:text-[#D2F865]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>

    <nav
      aria-label="Pages"
      className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-[#172B1F] bg-[#0D1912]/95 p-1.5 shadow-xl shadow-black/40 backdrop-blur lg:hidden"
    >
      {NAV_PAGES.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          aria-label={label}
          className={({ isActive }) =>
            cn(
              'flex h-10 w-10 items-center justify-center rounded-xl transition',
              isActive ? 'bg-[#D2F865] text-[#0D1912] shadow-md shadow-[#D2F865]/20 font-bold' : 'text-[#8FA396] hover:text-[#D2F865]'
            )
          }
        >
          <Icon className="h-[18px] w-[18px]" />
        </NavLink>
      ))}
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-[#7E9587] transition hover:bg-[#1E3326] hover:text-[#D2F865]"
      >
        <LogOut className="h-[18px] w-[18px]" />
      </button>
    </nav>
  </>
);
