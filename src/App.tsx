import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
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
  Filter,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  MoreHorizontal,
  Search,
  Settings2,
  ShieldAlert,
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
  { label: 'Listings', path: '/listings', icon: Building2, count: '12' },
  { label: 'Verification', path: '/verification', icon: FileCheck2, count: '8' },
  { label: 'Users & profiles', path: '/users', icon: Users },
  { label: 'Requests & matches', path: '/requests', icon: ClipboardList },
  { label: 'Wallet & payments', path: '/wallet', icon: Wallet },
]

const workspaceNavigation = [
  { label: 'Support inbox', path: '/support', icon: LifeBuoy },
  { label: 'Audit log', path: '/audit', icon: Activity },
  { label: 'Settings', path: '/settings', icon: Settings2 },
]

const activityRows = [
  { initials: 'AO', name: 'Amina Okafor', action: 'submitted a new listing', detail: 'Shared apartment · Lekki Phase 1', time: '4 min ago', tone: 'violet' },
  { initials: 'CO', name: 'Chidi Okeke', action: 'uploaded verification documents', detail: 'Host verification · Yaba', time: '18 min ago', tone: 'blue' },
  { initials: 'TO', name: 'Tunde Ogunleye', action: 'completed a wallet top-up', detail: '₦10,000 · 100 points', time: '32 min ago', tone: 'green' },
  { initials: 'FA', name: 'Fatima Aliyu', action: 'sent a roommate request', detail: 'Roommate matching · Abuja', time: '1 hr ago', tone: 'orange' },
]

const listingRows = [
  { title: 'Bright room in a shared 3-bedroom flat', type: 'Shared apartment', area: 'Lekki Phase 1, Lagos', owner: 'Amina Okafor', status: 'Pending review', date: 'Today, 10:42 AM', initials: 'AO', tone: 'violet' },
  { title: 'Roommate wanted in a serene Yaba apartment', type: 'Roommate', area: 'Yaba, Lagos', owner: 'Chidi Okeke', status: 'Pending review', date: 'Today, 9:18 AM', initials: 'CO', tone: 'blue' },
  { title: 'Tenancy takeover — furnished mini flat', type: 'Takeover', area: 'Gwarinpa, Abuja', owner: 'Fatima Aliyu', status: 'Needs changes', date: 'Yesterday', initials: 'FA', tone: 'orange' },
  { title: 'Private room near the University of Lagos', type: 'Shared apartment', area: 'Akoka, Lagos', owner: 'Tunde Ogunleye', status: 'Published', date: 'Nov 18, 2026', initials: 'TO', tone: 'green' },
]

const chartData = [
  { day: 'Mon', users: 35, listings: 19 },
  { day: 'Tue', users: 48, listings: 27 },
  { day: 'Wed', users: 41, listings: 23 },
  { day: 'Thu', users: 65, listings: 34 },
  { day: 'Fri', users: 53, listings: 30 },
  { day: 'Sat', users: 76, listings: 42 },
  { day: 'Sun', users: 68, listings: 37 },
]

const metrics = [
  { label: 'Total users', value: '2,840', change: '+12.8%', direction: 'up', icon: Users, color: 'mint', note: 'vs. last month' },
  { label: 'Active listings', value: '684', change: '+8.2%', direction: 'up', icon: Building2, color: 'lilac', note: 'vs. last month' },
  { label: 'Needs verification', value: '8', change: '3 urgent', direction: 'neutral', icon: ShieldAlert, color: 'peach', note: 'awaiting review' },
  { label: 'Wallet volume', value: '₦4.28m', change: '+6.4%', direction: 'up', icon: CreditCard, color: 'sky', note: 'this month' },
]

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [previewNoticeVisible, setPreviewNoticeVisible] = useState(true)
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
              <Icon size={18} strokeWidth={1.8} /><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}
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
          <button className="admin-user"><div className="profile-avatar">KA</div><span className="admin-user-copy"><strong>Kemi Adebayo</strong><small>Super admin</small></span><MoreHorizontal size={19} className="muted-icon" /></button>
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
            <button className="topbar-profile" aria-label="Admin account menu"><div className="profile-avatar">KA</div><ChevronDown size={15} className="muted-icon" /></button>
          </div>
        </header>

        <main className="page-content">
          {previewNoticeVisible && <div className="preview-notice"><span className="notice-dot" /><strong>Preview environment</strong><span>Dashboard figures and records are sample UI data, not live production data.</span><button aria-label="Dismiss preview notice" onClick={() => setPreviewNoticeVisible(false)}><X size={15} /></button></div>}
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="*" element={<ModulePage title={pageTitle} path={location.pathname} />} />
          </Routes>
          <footer className="page-footer"><span>© 2026 DynamoHomez</span><span>Admin console <i className="footer-separator">·</i> Preview build</span></footer>
        </main>
      </div>
    </div>
  )
}

function OverviewPage() {
  return <>
    <section className="page-heading">
      <div><p className="eyebrow">THURSDAY, NOVEMBER 20, 2026</p><h1>Good morning, Kemi <span className="wave">✳</span></h1><p className="heading-subtitle">Here’s what’s happening across your platform today.</p></div>
      <button className="secondary-button" disabled title="Live metrics will be connected after the protected admin API is ready"><span className="live-dot" /> Sample snapshot</button>
    </section>

    <section className="metric-grid" aria-label="Platform summary">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return <article className="metric-card" key={metric.label}>
          <div className={`metric-icon ${metric.color}`}><Icon size={19} strokeWidth={1.9} /></div>
          <div className="metric-label">{metric.label}<button aria-label={`More about ${metric.label}`} className="metric-more"><MoreHorizontal size={17} /></button></div>
          <div className="metric-value">{metric.value}</div>
          <div className="metric-note"><span className={metric.direction === 'up' ? 'positive-change' : 'neutral-change'}>{metric.direction === 'up' && <ArrowUpRight size={13} />}{metric.change}</span><span>{metric.note}</span></div>
        </article>
      })}
    </section>

    <section className="overview-grid">
      <article className="panel trend-panel">
          <div className="panel-header"><div><h2>Platform activity</h2><p>Illustrative user and listing trend</p></div><button className="select-button" disabled>Last 7 days <ChevronDown size={15} /></button></div>
        <div className="chart-legend"><span><i className="legend-dot users-dot" /> New users</span><span><i className="legend-dot listings-dot" /> New listings</span></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
          <defs><linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2c8a67" stopOpacity={0.17} /><stop offset="100%" stopColor="#2c8a67" stopOpacity={0} /></linearGradient><linearGradient id="listingsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a7a1ee" stopOpacity={0.17} /><stop offset="100%" stopColor="#a7a1ee" stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid vertical={false} stroke="#eef0ee" strokeDasharray="4 5" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#929a96', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#929a96', fontSize: 12 }} />
          <Tooltip contentStyle={{ border: '1px solid #e8ece8', borderRadius: 12, boxShadow: '0 8px 24px #102e1a12' }} />
          <Area type="monotone" dataKey="users" name="New users" stroke="#2c8a67" strokeWidth={2.5} fill="url(#usersFill)" />
          <Area type="monotone" dataKey="listings" name="New listings" stroke="#a7a1ee" strokeWidth={2.5} fill="url(#listingsFill)" />
        </AreaChart></ResponsiveContainer></div>
      </article>

      <article className="panel attention-panel">
        <div className="panel-header"><div><h2>Needs your attention</h2><p>Items waiting on your team</p></div><button className="text-action">View all <ArrowRight size={14} /></button></div>
        <div className="attention-list">
          <Link to="/verification" className="attention-item"><span className="attention-icon attention-amber"><FileCheck2 size={17} /></span><span className="attention-copy"><strong>Host verifications</strong><small>Waiting for document review</small></span><span className="attention-count">8</span><ChevronRight size={15} className="muted-icon" /></Link>
          <Link to="/listings" className="attention-item"><span className="attention-icon attention-violet"><Building2 size={17} /></span><span className="attention-copy"><strong>Listing reviews</strong><small>New submissions to review</small></span><span className="attention-count">12</span><ChevronRight size={15} className="muted-icon" /></Link>
          <Link to="/support" className="attention-item"><span className="attention-icon attention-blue"><LifeBuoy size={17} /></span><span className="attention-copy"><strong>Open support cases</strong><small>Awaiting first response</small></span><span className="attention-count">5</span><ChevronRight size={15} className="muted-icon" /></Link>
        </div>
        <div className="attention-footer"><span className="sparkle">✦</span><span><strong>All caught up?</strong><small>Take a moment to check recent activity.</small></span></div>
      </article>
    </section>

    <section className="panel activity-panel">
      <div className="panel-header activity-heading"><div><h2>Recent platform activity</h2><p>A quick look at what’s happening across DynamoHomez</p></div><button className="select-button">All activity <ChevronDown size={15} /></button></div>
      <div className="table-scroll"><table className="activity-table"><thead><tr><th>USER</th><th>ACTIVITY</th><th>DETAILS</th><th>TIME</th><th aria-label="Actions" /></tr></thead><tbody>
        {activityRows.map((row) => <tr key={row.name}><td><div className="table-user"><div className={`person-avatar ${row.tone}`}>{row.initials}</div><strong>{row.name}</strong></div></td><td className="activity-action">{row.action}</td><td className="table-detail">{row.detail}</td><td className="table-time">{row.time}</td><td><button className="row-more" aria-label={`More actions for ${row.name}`}><MoreHorizontal size={18} /></button></td></tr>)}
      </tbody></table></div>
      <Link to="/audit" className="table-bottom-link">View activity log <ArrowRight size={15} /></Link>
    </section>

    <section className="panel listings-panel">
      <div className="panel-header activity-heading"><div><h2>Latest listings</h2><p>Sample records for layout preview</p></div><div className="listing-controls"><button className="select-button" disabled><Filter size={14} /> Filter <ChevronDown size={15} /></button><Link to="/listings" className="text-action">View listings <ArrowRight size={14} /></Link></div></div>
      <div className="table-scroll"><table className="activity-table listings-table"><thead><tr><th>LISTING</th><th>TYPE</th><th>OWNER</th><th>STATUS</th><th>SUBMITTED</th><th aria-label="Actions" /></tr></thead><tbody>
        {listingRows.map((row) => <tr key={row.title}><td><div className="listing-title-cell"><strong>{row.title}</strong><small>{row.area}</small></div></td><td><span className="type-pill">{row.type}</span></td><td><div className="table-user compact-user"><div className={`person-avatar ${row.tone}`}>{row.initials}</div><strong>{row.owner}</strong></div></td><td><StatusBadge status={row.status} /></td><td className="table-time">{row.date}</td><td><button className="row-more" aria-label={`More actions for ${row.title}`}><MoreHorizontal size={18} /></button></td></tr>)}
      </tbody></table></div>
      <div className="table-pagination"><span>Showing <strong>4</strong> of <strong>684</strong> listings</span><div><button aria-label="Previous page" disabled><ChevronLeft size={16} /></button><button aria-label="Next page"><ChevronRight size={16} /></button></div></div>
    </section>
  </>
}

function StatusBadge({ status }: { status: string }) {
  const style = status === 'Published' ? 'status-green' : status === 'Needs changes' ? 'status-amber' : 'status-blue'
  return <span className={`status-badge ${style}`}><i />{status}</span>
}

function ModulePage({ title, path }: { title: string; path: string }) {
  const [query, setQuery] = useState('')
  const isListings = path === '/listings'
  const rows = useMemo(() => listingRows.filter((row) => `${row.title} ${row.type} ${row.owner} ${row.area} ${row.status}`.toLowerCase().includes(query.toLowerCase())), [query])

  return <>
    <section className="page-heading module-heading"><div><p className="eyebrow">OPERATIONS</p><h1>{title}</h1><p className="heading-subtitle">{isListings ? 'Review and manage shared, roommate, and takeover listings.' : `A dedicated workspace for ${title.toLowerCase()} operations.`}</p></div><div className="module-actions"><button className="secondary-button" disabled title="Filters will be connected with the listings API"><Filter size={15} /> Filters</button></div></section>
    <div className="module-preview"><div className="preview-icon">{isListings ? <Building2 size={21} /> : <BadgeCheck size={21} />}</div><div><strong>{isListings ? 'Listings workspace preview' : `${title} workspace`}</strong><p>This area is ready for its protected backend integration. Preview records below are illustrative and cannot be changed.</p></div><span className="preview-chip">PREVIEW</span></div>
    {isListings ? <section className="panel module-table-panel">
      <div className="table-toolbar"><label className="table-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search preview listings, owners, or locations" /></label><button className="select-button" disabled title="Server-side filtering will be connected with the listings API"><Filter size={15} /> Filters</button><button className="select-button" disabled>All statuses <ChevronDown size={15} /></button></div>
      <div className="table-scroll"><table className="activity-table listings-table"><thead><tr><th>LISTING</th><th>TYPE</th><th>OWNER</th><th>STATUS</th><th>SUBMITTED</th><th aria-label="Actions" /></tr></thead><tbody>
        {rows.map((row) => <tr key={row.title}><td><div className="listing-title-cell"><strong>{row.title}</strong><small>{row.area}</small></div></td><td><span className="type-pill">{row.type}</span></td><td><div className="table-user compact-user"><div className={`person-avatar ${row.tone}`}>{row.initials}</div><strong>{row.owner}</strong></div></td><td><StatusBadge status={row.status} /></td><td className="table-time">{row.date}</td><td><button className="row-more" aria-label={`More actions for ${row.title}`}><MoreHorizontal size={18} /></button></td></tr>)}
        {rows.length === 0 && <tr><td colSpan={6} className="no-results">No preview listings match “{query}”.</td></tr>}
      </tbody></table></div>
      <div className="table-pagination"><span>Showing <strong>{rows.length}</strong> preview records</span><div><button aria-label="Previous page" disabled><ChevronLeft size={16} /></button><button aria-label="Next page"><ChevronRight size={16} /></button></div></div>
    </section> : <section className="module-empty panel"><div className="empty-illustration"><Settings2 size={25} /></div><h2>Backend integration comes next</h2><p>We’ll connect this page to protected admin APIs before showing live records or enabling management actions.</p><Link to="/" className="text-action">Back to overview <ArrowRight size={14} /></Link></section>}
    <div className="security-note"><ShieldAlert size={16} /><span>Administrative changes will remain disabled until server-side authorization and audit logging are in place.</span></div>
  </>
}

export default App
