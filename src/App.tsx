import { useEffect, useState, type FormEvent } from 'react'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  FileCheck2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Search,
  Settings2,
  ShieldAlert,
  RefreshCw,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'

const navigation = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Listings', path: '/listings', icon: Building2 },
  { label: 'Verification', path: '/verification', icon: FileCheck2 },
  { label: 'Users & profiles', path: '/users', icon: Users },
  { label: 'Requests & matches', path: '/requests', icon: ClipboardList },
  { label: 'Wallet & payments', path: '/wallet', icon: Wallet },
]

const workspaceNavigation = [
  { label: 'Support inbox', path: '/support', icon: LifeBuoy },
  { label: 'Audit log', path: '/audit', icon: Activity },
  { label: 'Settings', path: '/settings', icon: Settings2 },
]

type AdminSession = {
  user: { id: string; email: string; name: string; role: string; roles: string[] }
  tokens: { accessToken: string; refreshToken: string; accessTokenExpiresIn: string; refreshTokenExpiresIn: string }
}

type AdminOverview = {
  users: number
  listings: number
  pendingListings: number
  pendingVerifications: number
  pendingRequests: number
  walletVolumeNaira: number
  trend: Array<{ date: string; users: number; listings: number }>
  updatedAt: string
}

type AdminListing = {
  id: string
  title: string
  type: string
  city: string
  area: string
  ownerName: string
  status: string
  createdAt: string
}

type AdminListingPage = { items: AdminListing[]; page: number; limit: number; total: number }
const ADMIN_SESSION_KEY = 'dh_admin_session'

function readAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY)
    return raw ? JSON.parse(raw) as AdminSession : null
  } catch {
    return null
  }
}

async function adminFetch<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.success) {
    const error = new Error(result?.error || result?.message || 'Admin API request failed') as Error & { status?: number }
    error.status = response.status
    throw error
  }
  return result.data as T
}

function App() {
  const [session, setSession] = useState<AdminSession | null>(readAdminSession)

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setSession(null)
  }

  const handleLogin = (nextSession: AdminSession) => {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
  }

  if (!session?.tokens?.accessToken) {
    return <AdminLoginPage onLogin={handleLogin} />
  }

  return <AdminShell session={session} onLogout={handleLogout} />
}

function AdminShell({ session, onLogout }: { session: AdminSession; onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const location = useLocation()
  const allNavigation = navigation.concat(workspaceNavigation)
  const currentPage = allNavigation.find((item) => item.path === location.pathname)
  const searchResults = search.trim()
    ? allNavigation.filter((item) => item.label.toLowerCase().includes(search.trim().toLowerCase()))
    : []
  const pageTitle = currentPage?.label ?? 'Overview'

  return (
    <div className="admin-app">
      {sidebarOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Building2 size={20} strokeWidth={2.2} /></div>
          <div className="brand-copy"><strong>dynamo<span>homez</span></strong><small>ADMIN CONSOLE</small></div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">D</div>
          <div className="workspace-copy"><strong>DynamoHomez</strong><span>Operations team</span></div>
          <ChevronDown size={16} className="muted-icon" />
        </div>

        <nav className="sidebar-nav" aria-label="Admin navigation">
          <p className="nav-caption">WORKSPACE</p>
          {navigation.map((item) => {
            const Icon = item.icon
            return <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{item.label}</span>
            </NavLink>
          })}

          <p className="nav-caption nav-caption-spaced">MANAGEMENT</p>
          {workspaceNavigation.map((item) => {
            const Icon = item.icon
            return <NavLink key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{item.label}</span>
            </NavLink>
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Need a hand?</strong><p>Visit the admin help center.</p><button type="button">Get support <ArrowRight size={14} /></button></div>
          <button className="admin-user" onClick={onLogout}><div className="profile-avatar">{getInitials(session.user.name)}</div><span className="admin-user-copy"><strong>{session.user.name}</strong><small>Administrator</small></span><LogOut size={17} className="muted-icon" /></button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div>
          <div className="topbar-actions">
            <div className="global-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search pages..." aria-label="Search admin pages" /><kbd>⌘ K</kbd>
              {search.trim() && <div className="search-results">{searchResults.length ? searchResults.map((item) => <Link key={item.path} to={item.path} onClick={() => setSearch('')}><span>{item.label}</span><ArrowRight size={14} /></Link>) : <span className="search-empty">No matching pages</span>}</div>}
            </div>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><i /></button>
            <div className="topbar-divider" />
            <button className="topbar-profile" aria-label="Sign out" onClick={onLogout}><div className="profile-avatar">{getInitials(session.user.name)}</div><ChevronDown size={15} className="muted-icon" /></button>
          </div>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<OverviewPage session={session} onLogout={onLogout} />} />
            <Route path="/listings" element={<ModulePage title="Listings" path="/listings" session={session} onLogout={onLogout} />} />
            <Route path="*" element={<ModulePage title={pageTitle} path={location.pathname} session={session} onLogout={onLogout} />} />
          </Routes>
          <footer className="page-footer"><span>© {new Date().getFullYear()} DynamoHomez</span><span>Admin console <i className="footer-separator">·</i> Protected workspace</span></footer>
        </main>
      </div>
    </div>
  )
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || 'AD'
}

function OverviewPage({ session, onLogout }: { session: AdminSession; onLogout: () => void }) {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [latestListings, setLatestListings] = useState<AdminListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    Promise.all([
      adminFetch<AdminOverview>('/admin/overview', session.tokens.accessToken),
      adminFetch<AdminListingPage>('/admin/listings?page=1&limit=4', session.tokens.accessToken),
    ]).then(([nextOverview, listingPage]) => {
      if (!active) return
      setOverview(nextOverview)
      setLatestListings(listingPage.items)
    }).catch((requestError: Error & { status?: number }) => {
      if (!active) return
      if (requestError.status === 401) onLogout()
      else setError(requestError.status === 403 ? 'This account does not have administrator access.' : requestError.message)
    }).finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [session.tokens.accessToken, onLogout, refreshKey])

  const metrics = overview ? [
    { label: 'Total users', value: overview.users.toLocaleString(), note: 'registered accounts', icon: Users, color: 'mint' },
    { label: 'All listings', value: overview.listings.toLocaleString(), note: 'marketplace listings', icon: Building2, color: 'lilac' },
    { label: 'Needs verification', value: overview.pendingVerifications.toLocaleString(), note: 'documents pending', icon: ShieldAlert, color: 'peach' },
    { label: 'Wallet volume', value: formatNaira(overview.walletVolumeNaira), note: 'this month', icon: CreditCard, color: 'sky' },
  ] : []
  const chartData = overview?.trend.map((item) => ({
    ...item,
    day: new Intl.DateTimeFormat('en-NG', { weekday: 'short' }).format(new Date(`${item.date}T12:00:00`)),
  })) ?? []

  return <>
    <section className="page-heading">
      <div><p className="eyebrow">PLATFORM OPERATIONS</p><h1>Welcome back, {session.user.name.split(' ')[0]} <span className="wave">✳</span></h1><p className="heading-subtitle">Live operational summary from the platform database.</p></div>
      <button className="secondary-button" onClick={() => { setError(''); setLoading(true); setRefreshKey((key) => key + 1) }} disabled={loading}><RefreshCw size={14} className={loading ? 'spin-icon' : ''} /> Refresh</button>
    </section>

    {error && <div className="api-error" role="alert"><ShieldAlert size={17} /><span>{error}</span><button onClick={() => setRefreshKey((key) => key + 1)}>Try again</button></div>}

    <section className="metric-grid" aria-label="Platform summary">
      {(loading && !overview ? Array.from({ length: 4 }, (_, index) => ({ label: `Loading metric ${index + 1}`, value: '—', note: 'Loading from server', icon: Activity, color: 'mint' })) : metrics).map((metric) => {
        const Icon = metric.icon
        return <article className="metric-card" key={metric.label}>
          <div className={`metric-icon ${metric.color}`}><Icon size={19} strokeWidth={1.9} /></div>
          <div className="metric-label">{metric.label}</div>
          <div className="metric-value">{metric.value}</div>
          <div className="metric-note">{metric.note}</div>
        </article>
      })}
    </section>

    <section className="overview-grid">
      <article className="panel trend-panel">
        <div className="panel-header"><div><h2>Platform activity</h2><p>New accounts and listings · last 7 days</p></div></div>
        <div className="chart-legend"><span><i className="legend-dot users-dot" /> New users</span><span><i className="legend-dot listings-dot" /> New listings</span></div>
        <div className="chart-wrap">{chartData.length > 0 && <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
          <defs><linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2c8a67" stopOpacity={0.17} /><stop offset="100%" stopColor="#2c8a67" stopOpacity={0} /></linearGradient><linearGradient id="listingsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a7a1ee" stopOpacity={0.17} /><stop offset="100%" stopColor="#a7a1ee" stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid vertical={false} stroke="#eef0ee" strokeDasharray="4 5" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#929a96', fontSize: 12 }} dy={10} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#929a96', fontSize: 12 }} />
          <Tooltip contentStyle={{ border: '1px solid #e8ece8', borderRadius: 12, boxShadow: '0 8px 24px #102e1a12' }} />
          <Area type="monotone" dataKey="users" name="New users" stroke="#2c8a67" strokeWidth={2.5} fill="url(#usersFill)" />
          <Area type="monotone" dataKey="listings" name="New listings" stroke="#a7a1ee" strokeWidth={2.5} fill="url(#listingsFill)" />
        </AreaChart></ResponsiveContainer>}{!loading && chartData.length === 0 && <div className="chart-empty">No activity data available yet.</div>}</div>
      </article>

      <article className="panel attention-panel">
        <div className="panel-header"><div><h2>Needs your attention</h2><p>Current pending queues</p></div></div>
        <div className="attention-list">
          <Link to="/verification" className="attention-item"><span className="attention-icon attention-amber"><FileCheck2 size={17} /></span><span className="attention-copy"><strong>Host verifications</strong><small>Documents awaiting review</small></span><span className="attention-count">{overview?.pendingVerifications ?? '—'}</span><ChevronRight size={15} className="muted-icon" /></Link>
          <Link to="/listings" className="attention-item"><span className="attention-icon attention-violet"><Building2 size={17} /></span><span className="attention-copy"><strong>Listing reviews</strong><small>Listings marked for review</small></span><span className="attention-count">{overview?.pendingListings ?? '—'}</span><ChevronRight size={15} className="muted-icon" /></Link>
          <Link to="/requests" className="attention-item"><span className="attention-icon attention-blue"><ClipboardList size={17} /></span><span className="attention-copy"><strong>Pending requests</strong><small>Roommate and office requests</small></span><span className="attention-count">{overview?.pendingRequests ?? '—'}</span><ChevronRight size={15} className="muted-icon" /></Link>
        </div>
        <div className="attention-footer"><span className="sparkle">✦</span><span><strong>Queue overview</strong><small>Counts update when you refresh this page.</small></span></div>
      </article>
    </section>

    <section className="panel activity-panel">
      <div className="panel-header activity-heading"><div><h2>Recent platform activity</h2><p>Activity feed will appear when audit events are implemented.</p></div><Link to="/audit" className="text-action">Audit log <ArrowRight size={14} /></Link></div>
      <div className="no-activity"><Activity size={18} /><span>There are no admin audit events available yet.</span></div>
    </section>

    <section className="panel listings-panel">
      <div className="panel-header activity-heading"><div><h2>Latest listings</h2><p>Read-only listing summaries from the backend</p></div><Link to="/listings" className="text-action">View listings <ArrowRight size={14} /></Link></div>
      <ListingTable items={latestListings} loading={loading} />
    </section>
  </>
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
}

function AdminLoginPage({ onLogin }: { onLogin: (session: AdminSession) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || result?.message || 'Unable to sign in. Check your credentials.')
      }

      const nextSession = result.data as AdminSession
      const roles = nextSession.user?.roles || [nextSession.user?.role]
      if (!roles.includes('admin')) {
        throw new Error('This account does not have administrator access. Contact your system administrator.')
      }
      onLogin(nextSession)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="login-page">
    <section className="login-card">
      <div className="brand-mark login-brand-mark"><Building2 size={22} strokeWidth={2.2} /></div>
      <p className="login-eyebrow">DYNAMO HOMEZ · OPERATIONS</p>
      <h1>Admin sign in</h1>
      <p className="login-description">Sign in with an administrator account to continue to the operations console.</p>
      {error && <div className="login-error" role="alert"><ShieldAlert size={17} /><span>{error}</span></div>}
      <form onSubmit={submit} className="login-form">
        <label htmlFor="admin-email">Email address</label>
        <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@dynamohomez.ng" required />
        <label htmlFor="admin-password">Password</label>
        <div className="password-field"><input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <button className="primary-button login-submit" type="submit" disabled={loading}>{loading ? <><LoaderCircle size={16} className="spin-icon" /> Signing in...</> : <><LockKeyhole size={16} /> Sign in securely</>}</button>
      </form>
      <div className="login-security"><ShieldAlert size={15} /><span>Access is restricted to provisioned admin accounts. User signup does not grant admin access.</span></div>
    </section>
    <p className="login-footer">DynamoHomez Admin <span>·</span> Secure operations workspace</p>
  </main>
}

function StatusBadge({ status }: { status: string }) {
  const label = status === 'in-review' ? 'In review' : status.charAt(0).toUpperCase() + status.slice(1)
  const style = status === 'verified' ? 'status-green' : status === 'rejected' ? 'status-amber' : status === 'pending' || status === 'in-review' ? 'status-blue' : 'status-neutral'
  return <span className={`status-badge ${style}`}><i />{label}</span>
}

function formatListingType(type: string) {
  if (type === 'shared') return 'Shared apartment'
  if (type === 'roommate') return 'Roommate'
  if (type === 'takeover') return 'Takeover'
  return type
}

function formatListingDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(date)
}

function ListingTable({ items, loading }: { items: AdminListing[]; loading: boolean }) {
  return <div className="table-scroll"><table className="activity-table listings-table"><thead><tr><th>LISTING</th><th>TYPE</th><th>OWNER</th><th>VERIFICATION</th><th>SUBMITTED</th></tr></thead><tbody>
    {items.map((item) => <tr key={item.id}><td><div className="listing-title-cell"><strong>{item.title}</strong><small>{[item.area, item.city].filter(Boolean).join(', ') || 'Location not provided'}</small></div></td><td><span className="type-pill">{formatListingType(item.type)}</span></td><td><div className="table-user compact-user"><div className="person-avatar green">{getInitials(item.ownerName)}</div><strong>{item.ownerName}</strong></div></td><td><StatusBadge status={item.status} /></td><td className="table-time">{formatListingDate(item.createdAt)}</td></tr>)}
    {!loading && items.length === 0 && <tr><td colSpan={5} className="no-results">No listings found.</td></tr>}
    {loading && items.length === 0 && <tr><td colSpan={5} className="no-results"><LoaderCircle size={16} className="spin-icon inline-spinner" /> Loading listings…</td></tr>}
  </tbody></table></div>
}

function ModulePage({ title, path, session, onLogout }: { title: string; path: string; session: AdminSession; onLogout: () => void }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [listingPage, setListingPage] = useState<AdminListingPage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isListings = path === '/listings'

  useEffect(() => {
    if (!isListings) return
    let active = true
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (query.trim()) params.set('search', query.trim())
      adminFetch<AdminListingPage>(`/admin/listings?${params.toString()}`, session.tokens.accessToken)
        .then((data) => { if (active) setListingPage(data) })
        .catch((requestError: Error & { status?: number }) => {
          if (!active) return
          if (requestError.status === 401) onLogout()
          else setError(requestError.status === 403 ? 'This account does not have administrator access.' : requestError.message)
        })
        .finally(() => { if (active) setLoading(false) })
    }, 250)
    return () => { active = false; window.clearTimeout(timer) }
  }, [isListings, page, query, session.tokens.accessToken, onLogout])

  return <>
    <section className="page-heading module-heading"><div><p className="eyebrow">OPERATIONS</p><h1>{title}</h1><p className="heading-subtitle">{isListings ? 'Read-only summaries for shared, roommate, and takeover listings.' : `A dedicated workspace for ${title.toLowerCase()} operations.`}</p></div></section>
    {!isListings ? <><div className="module-preview"><div className="preview-icon"><BadgeCheck size={21} /></div><div><strong>{title} workspace</strong><p>This module will be enabled once its protected API and audit workflow are implemented.</p></div><span className="preview-chip">NOT CONNECTED</span></div><section className="module-empty panel"><div className="empty-illustration"><Settings2 size={25} /></div><h2>Backend integration comes next</h2><p>Live records and management actions remain unavailable until the backend exposes the required protected endpoints.</p><Link to="/" className="text-action">Back to overview <ArrowRight size={14} /></Link></section></> : <section className="panel module-table-panel">
      <div className="table-toolbar"><label className="table-search"><Search size={16} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search listings, owners, or locations" /></label><span className="read-only-label"><LockKeyhole size={13} /> Read only</span></div>
      {error && <div className="table-error" role="alert">{error}</div>}
      <ListingTable items={listingPage?.items ?? []} loading={loading} />
      <div className="table-pagination"><span>Showing <strong>{listingPage?.items.length ?? 0}</strong> of <strong>{listingPage?.total ?? 0}</strong> listings</span><div><button aria-label="Previous page" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={16} /></button><span className="page-number">{page}</span><button aria-label="Next page" disabled={!listingPage || page * listingPage.limit >= listingPage.total || loading} onClick={() => setPage((value) => value + 1)}><ChevronRight size={16} /></button></div></div>
    </section>}
    <div className="security-note"><ShieldAlert size={16} /><span>Administrative mutations remain disabled. All data access is enforced by the backend admin role guard.</span></div>
  </>
}

export default App
