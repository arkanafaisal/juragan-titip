// @ts-nocheck
import React from "react";
import {
    LayoutDashboard,
    Package,
    Store,
    Banknote,
    BarChart,
    Plus,
    Settings,
    LogOut,
    Search,
    Bell,
    HelpCircle,
    Calendar,
    Wallet,
    TrendingUp,
    Minus,
    Receipt,
    AlertTriangle,
    Route,
    Filter,
    Truck
} from "lucide-react";

export default function Dashboard() {
    return (
        <div className="bg-background text-on-background font-body text-body antialiased h-screen overflow-hidden flex">
            {/* SideNavBar */}
            <nav className="bg-surface-container-lowest dark:bg-inverse-surface shadow-sm border-r border-outline-variant dark:border-outline fixed left-0 top-0 h-full w-[240px] z-40 hidden lg:flex flex-col p-md gap-sm">
                {/* Header */}
                <div className="flex items-center gap-sm px-sm py-md mb-sm">
                    <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-on-primary font-h2 text-h2 font-bold">
                        J
                    </div>
                    <div>
                        <div className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed tracking-tight leading-none">
                            JuraganTitip
                        </div>
                        <div className="font-caption text-caption text-text-secondary mt-xs">
                            Consignment System
                        </div>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex-1 flex flex-col gap-xs">
                    {/* Active Tab: Dashboard */}
                    <a
                        className="flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container dark:bg-primary dark:text-on-primary font-bold rounded-lg scale-95 active:scale-90 transition-transform"
                        href="#"
                    >
                        <LayoutDashboard fill="currentColor" size={24} />
                        <span>Dashboard</span>
                    </a>

                    {/* Inactive Tabs */}
                    <a
                        className="flex items-center gap-md px-md py-sm text-text-secondary dark:text-on-surface-variant hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all rounded-lg"
                        href="#"
                    >
                        <Package size={24} />
                        <span>Produk</span>
                    </a>
                    <a
                        className="flex items-center gap-md px-md py-sm text-text-secondary dark:text-on-surface-variant hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all rounded-lg"
                        href="#"
                    >
                        <Store size={24} />
                        <span>Toko</span>
                    </a>
                    <a
                        className="flex items-center gap-md px-md py-sm text-text-secondary dark:text-on-surface-variant hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all rounded-lg"
                        href="#"
                    >
                        <Banknote size={24} />
                        <span>Keuangan</span>
                    </a>
                    <a
                        className="flex items-center gap-md px-md py-sm text-text-secondary dark:text-on-surface-variant hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all rounded-lg"
                        href="#"
                    >
                        <BarChart size={24} />
                        <span>Laporan</span>
                    </a>
                </div>

                {/* CTA */}
                <div className="mt-auto mb-md">
                    <button className="w-full flex items-center justify-center gap-sm bg-primary text-on-primary py-sm px-md rounded-lg font-body text-body font-semibold hover:opacity-90 transition-opacity">
                        <Plus size={18} className="text-[18px]" />
                        Add New Entry
                    </button>
                </div>

                {/* Footer Tabs */}
                <div className="border-t border-outline-variant pt-sm flex flex-col gap-xs">
                    <a
                        className="flex items-center gap-md px-md py-sm text-text-secondary dark:text-on-surface-variant hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all rounded-lg"
                        href="#"
                    >
                        <Settings size={24} />
                        <span>Settings</span>
                    </a>
                    <a
                        className="flex items-center gap-md px-md py-sm text-text-secondary dark:text-on-surface-variant hover:bg-surface-container hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all rounded-lg"
                        href="#"
                    >
                        <LogOut size={24} />
                        <span>Logout</span>
                    </a>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 lg:ml-[240px] h-full relative bg-background">
                {/* TopAppBar */}
                <header className="bg-surface dark:bg-surface-container-high border-b border-outline-variant dark:border-outline shadow-sm flex justify-between items-center w-full px-lg h-16 shrink-0 z-30">
                    {/* Left: Search */}
                    <div className="flex-1 flex items-center">
                        <div className="relative w-full max-w-md hidden md:block">
                            <Search
                                size={20}
                                className="absolute left-sm top-1/2 -translate-y-1/2 text-text-muted text-[20px]"
                            />
                            <input
                                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-1.5 pl-xl pr-sm font-body-sm text-body-sm text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                placeholder="Search orders, products, or stores..."
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Right: Actions & Profile */}
                    <div className="flex items-center gap-sm">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors active:opacity-80 transition-all duration-100 relative">
                            <Bell size={24} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-surface"></span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary dark:text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-variant transition-colors active:opacity-80 transition-all duration-100">
                            <HelpCircle size={24} />
                        </button>

                        <div className="h-8 w-px bg-outline-variant mx-sm hidden sm:block"></div>

                        <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-low p-1 rounded-lg transition-colors">
                            <div className="text-right hidden sm:block">
                                <div className="font-body-sm text-body-sm font-medium text-text-primary">Budi Santoso</div>
                                <div className="font-caption text-caption text-text-secondary">Admin Pusat</div>
                            </div>
                            <img
                                alt="User profile avatar"
                                className="w-9 h-9 rounded-full border border-outline-variant object-cover"
                                data-alt="A professional headshot of a young Asian male with short black hair, wearing a casual light blue button-down shirt. The lighting is soft and natural, suggesting a modern office environment. The background is slightly blurred with a bright, airy feel, matching a clean, corporate SaaS UI aesthetic."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAugz8J4SKBntMiJ-3D6fx2agtST9ckJQVOpiiqCjX9UCSv298UyCGFKY1bGPE_dA97RAY2LR-WQp3n7Qa8fa7CLDT5xAMoAF6pMbYPNnVslNnCTyxxv9hGw3McI_IMUyGdIZpDXdHd1Dci0p8OraYLTmAVg_vZk47rFm78hSYiD_65C0YLnq8QqqsrwFJH7PSoBEH0oLXBNkXdkq2sFx4135PralaYT9JDNEUrGABK1tRsQxj9wyt7ZOItunWJCPUPkYxNcICPXURC"
                            />
                        </div>
                    </div>
                </header>

                {/* Scrollable Canvas */}
                <div className="flex-1 overflow-y-auto p-md lg:p-lg">
                    <div className="max-w-container-max mx-auto space-y-lg">
                        {/* Page Greeting */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md">
                            <div>
                                <h1 className="font-h1 text-h1 text-on-surface">Overview</h1>
                                <p className="font-body text-body text-text-secondary mt-xs">
                                    Here's what's happening with your consignment business today.
                                </p>
                            </div>
                            <div className="flex items-center gap-xs text-text-secondary bg-surface-bright px-sm py-xs rounded-md border border-outline-variant shadow-sm">
                                <Calendar size={18} className="text-[18px]" />
                                <span className="font-data-md text-data-md">Oct 24, 2023</span>
                            </div>
                        </div>

                        {/* Bento Grid: Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
                            {/* Stat 1: Pendapatan */}
                            <div className="bg-surface rounded-xl p-[20px] shadow-sm border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow cursor-default group relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-success/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-sm relative z-10">
                                    <span className="font-body-sm text-body-sm text-text-secondary font-medium uppercase tracking-wide">
                                        Pendapatan
                                    </span>
                                    <Wallet size={20} className="text-success bg-success/10 p-1.5 rounded-md text-[20px]" />
                                </div>
                                <div className="relative z-10">
                                    <div className="font-data-lg text-data-lg text-on-surface text-[24px]">Rp 12.5jt</div>
                                    <div className="flex items-center gap-1 mt-xs">
                                        <TrendingUp size={14} className="text-success text-[14px]" />
                                        <span className="font-data-sm text-data-sm text-success font-medium">+8.2%</span>
                                        <span className="font-caption text-caption text-text-muted ml-1">vs last week</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stat 2: Stok Gudang */}
                            <div className="bg-surface rounded-xl p-[20px] shadow-sm border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow cursor-default group relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-sm relative z-10">
                                    <span className="font-body-sm text-body-sm text-text-secondary font-medium uppercase tracking-wide">
                                        Stok Gudang
                                    </span>
                                    <Package size={20} className="text-primary bg-primary/10 p-1.5 rounded-md text-[20px]" />
                                </div>
                                <div className="relative z-10">
                                    <div className="font-data-lg text-data-lg text-on-surface text-[24px]">342</div>
                                    <div className="flex items-center gap-1 mt-xs">
                                        <TrendingUp size={14} className="text-success text-[14px]" />
                                        <span className="font-data-sm text-data-sm text-success font-medium">+12</span>
                                        <span className="font-caption text-caption text-text-muted ml-1">new items</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stat 3: Toko Aktif */}
                            <div className="bg-surface rounded-xl p-[20px] shadow-sm border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow cursor-default group relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-info/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-sm relative z-10">
                                    <span className="font-body-sm text-body-sm text-text-secondary font-medium uppercase tracking-wide">
                                        Toko Aktif
                                    </span>
                                    <Store
                                        size={20}
                                        className="text-[hsl(var(--info))] bg-[hsl(var(--info))]/10 p-1.5 rounded-md text-[20px]"
                                        style={{ color: "hsl(262 83% 66%)", backgroundColor: "hsla(262, 83%, 66%, 0.1)" }}
                                    />
                                </div>
                                <div className="relative z-10">
                                    <div className="font-data-lg text-data-lg text-on-surface text-[24px]">15</div>
                                    <div className="flex items-center gap-1 mt-xs">
                                        <Minus size={14} className="text-text-muted text-[14px]" />
                                        <span className="font-data-sm text-data-sm text-text-secondary font-medium">0</span>
                                        <span className="font-caption text-caption text-text-muted ml-1">changes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stat 4: Piutang */}
                            <div className="bg-surface rounded-xl p-[20px] shadow-sm border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow cursor-default group relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-warning/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-sm relative z-10">
                                    <span className="font-body-sm text-body-sm text-text-secondary font-medium uppercase tracking-wide">
                                        Piutang
                                    </span>
                                    <Receipt
                                        size={20}
                                        className="text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 p-1.5 rounded-md text-[20px]"
                                        style={{ color: "hsl(38 92% 50%)", backgroundColor: "hsla(38, 92%, 50%, 0.1)" }}
                                    />
                                </div>
                                <div className="relative z-10">
                                    <div className="font-data-lg text-data-lg text-on-surface text-[24px]">Rp 3.2jt</div>
                                    <div className="flex items-center gap-1 mt-xs">
                                        <AlertTriangle
                                            size={14}
                                            className="text-warning text-[14px]"
                                            style={{ color: "hsl(38 92% 50%)" }}
                                        />
                                        <span
                                            className="font-data-sm text-data-sm text-warning font-medium"
                                            style={{ color: "hsl(38 92% 50%)" }}
                                        >
                                            Needs action
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Layout Grid: Chart/Table (Left) & Activity (Right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
                            {/* Left Column (Span 8) */}
                            <div className="lg:col-span-8 space-y-md flex flex-col">
                                {/* Sales Chart Placeholder (Glassmorphism-lite) */}
                                <div className="bg-surface rounded-xl shadow-sm border border-outline-variant p-[20px] flex flex-col">
                                    <div className="flex justify-between items-center mb-md">
                                        <div>
                                            <h2 className="font-h3 text-h3 text-on-surface">Sales Performance</h2>
                                            <p className="font-caption text-caption text-text-secondary">
                                                Revenue over the last 7 days
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 text-caption font-medium bg-surface-container-low text-text-primary rounded border border-outline-variant hover:bg-surface-variant transition-colors">
                                                Week
                                            </button>
                                            <button className="px-3 py-1 text-caption font-medium text-text-secondary hover:text-text-primary transition-colors">
                                                Month
                                            </button>
                                        </div>
                                    </div>

                                    {/* Chart Visual Placeholder */}
                                    <div className="h-[240px] w-full chart-bg relative rounded-md border border-outline-variant/50 overflow-hidden flex items-end px-4 pb-0 pt-4">
                                        {/* Bars representing data */}
                                        <div className="flex-1 flex items-end justify-around h-full gap-2 relative z-10 pb-6">
                                            <div className="w-full max-w-[40px] bg-primary/20 rounded-t-sm relative group cursor-pointer" style={{ height: "40%" }}>
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: "80%" }}></div>
                                            </div>
                                            <div className="w-full max-w-[40px] bg-primary/20 rounded-t-sm relative group cursor-pointer" style={{ height: "60%" }}>
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: "70%" }}></div>
                                            </div>
                                            <div className="w-full max-w-[40px] bg-primary/20 rounded-t-sm relative group cursor-pointer" style={{ height: "30%" }}>
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: "90%" }}></div>
                                            </div>
                                            <div className="w-full max-w-[40px] bg-primary/20 rounded-t-sm relative group cursor-pointer" style={{ height: "80%" }}>
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: "85%" }}></div>
                                            </div>
                                            <div className="w-full max-w-[40px] bg-primary/20 rounded-t-sm relative group cursor-pointer" style={{ height: "50%" }}>
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: "60%" }}></div>
                                            </div>
                                            <div className="w-full max-w-[40px] bg-primary/20 rounded-t-sm relative group cursor-pointer" style={{ height: "90%" }}>
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: "95%" }}></div>
                                            </div>
                                            <div className="w-full max-w-[40px] bg-primary/20 rounded-t-sm relative group cursor-pointer" style={{ height: "70%" }}>
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: "75%" }}></div>
                                            </div>
                                        </div>
                                        {/* X-axis labels */}
                                        <div className="absolute bottom-0 left-0 w-full flex justify-around px-4 py-1 border-t border-outline-variant/30 bg-surface/80 backdrop-blur-sm">
                                            <span className="font-data-sm text-data-sm text-text-muted">Mon</span>
                                            <span className="font-data-sm text-data-sm text-text-muted">Tue</span>
                                            <span className="font-data-sm text-data-sm text-text-muted">Wed</span>
                                            <span className="font-data-sm text-data-sm text-text-muted">Thu</span>
                                            <span className="font-data-sm text-data-sm text-text-muted">Fri</span>
                                            <span className="font-data-sm text-data-sm text-text-muted">Sat</span>
                                            <span className="font-data-sm text-data-sm text-text-muted">Sun</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Table: Toko Perlu Dikunjungi */}
                                <div className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                                    <div className="px-[20px] py-md border-b border-outline-variant flex justify-between items-center bg-surface-bright/50">
                                        <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                                            <Store
                                                size={20}
                                                className="text-[20px] text-warning"
                                                style={{ color: "hsl(38 92% 50%)" }}
                                            />
                                            Toko Perlu Dikunjungi
                                        </h2>
                                        <button className="text-primary font-body-sm text-body-sm font-medium hover:underline">
                                            View All
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-surface-bright border-b border-outline-variant">
                                                    <th className="px-[20px] py-sm font-caption text-caption text-text-secondary font-medium uppercase tracking-wider">Nama Toko</th>
                                                    <th className="px-[20px] py-sm font-caption text-caption text-text-secondary font-medium uppercase tracking-wider">Status Stok</th>
                                                    <th className="px-[20px] py-sm font-caption text-caption text-text-secondary font-medium uppercase tracking-wider">Terakhir Kunjungan</th>
                                                    <th className="px-[20px] py-sm font-caption text-caption text-text-secondary font-medium uppercase tracking-wider text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-outline-variant/50">
                                                <tr className="hover:bg-surface-container-low/50 transition-colors">
                                                    <td className="px-[20px] py-sm">
                                                        <div className="font-body-sm text-body-sm font-medium text-on-surface">Toko Makmur Jaya</div>
                                                        <div className="font-caption text-caption text-text-muted">Kec. Lowokwaru</div>
                                                    </td>
                                                    <td className="px-[20px] py-sm">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-caption text-caption font-medium border border-destructive/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span> Hampir Habis (3)
                                                        </span>
                                                    </td>
                                                    <td className="px-[20px] py-sm font-data-sm text-data-sm text-text-secondary">7 hari lalu</td>
                                                    <td className="px-[20px] py-sm text-right">
                                                        <button className="p-1 rounded-md text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                                                            <Route size={18} className="text-[18px]" />
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-surface-container-low/50 transition-colors">
                                                    <td className="px-[20px] py-sm">
                                                        <div className="font-body-sm text-body-sm font-medium text-on-surface">Warung Sederhana</div>
                                                        <div className="font-caption text-caption text-text-muted">Kec. Klojen</div>
                                                    </td>
                                                    <td className="px-[20px] py-sm">
                                                        <span
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning font-caption text-caption font-medium border border-warning/20"
                                                            style={{ color: "hsl(38 92% 50%)", borderColor: "hsla(38, 92%, 50%, 0.2)", backgroundColor: "hsla(38, 92%, 50%, 0.1)" }}
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "hsl(38 92% 50%)" }}></span> Perlu Setor Rp 1.2M
                                                        </span>
                                                    </td>
                                                    <td className="px-[20px] py-sm font-data-sm text-data-sm text-text-secondary">5 hari lalu</td>
                                                    <td className="px-[20px] py-sm text-right">
                                                        <button className="p-1 rounded-md text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                                                            <Route size={18} className="text-[18px]" />
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-surface-container-low/50 transition-colors">
                                                    <td className="px-[20px] py-sm">
                                                        <div className="font-body-sm text-body-sm font-medium text-on-surface">Kantin Kampus</div>
                                                        <div className="font-caption text-caption text-text-muted">Area UB</div>
                                                    </td>
                                                    <td className="px-[20px] py-sm">
                                                        <span
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-info/10 text-info font-caption text-caption font-medium border border-info/20"
                                                            style={{ color: "hsl(262 83% 66%)", borderColor: "hsla(262, 83%, 66%, 0.2)", backgroundColor: "hsla(262, 83%, 66%, 0.1)" }}
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "hsl(262 83% 66%)" }}></span> Jadwal Rutin
                                                        </span>
                                                    </td>
                                                    <td className="px-[20px] py-sm font-data-sm text-data-sm text-text-secondary">3 hari lalu</td>
                                                    <td className="px-[20px] py-sm text-right">
                                                        <button className="p-1 rounded-md text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                                                            <Route size={18} className="text-[18px]" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Span 4): Recent Activity Feed */}
                            <div className="lg:col-span-4 bg-surface rounded-xl shadow-sm border border-outline-variant flex flex-col h-full min-h-[400px]">
                                <div className="px-[20px] py-md border-b border-outline-variant flex justify-between items-center">
                                    <h2 className="font-h3 text-h3 text-on-surface">Recent Activity</h2>
                                    <button className="p-1 rounded-md text-text-secondary hover:bg-surface-container transition-colors">
                                        <Filter size={20} className="text-[20px]" />
                                    </button>
                                </div>
                                <div className="flex-1 p-[20px] relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-[36px] top-[20px] bottom-[20px] w-px bg-outline-variant"></div>

                                    <div className="space-y-6 relative">
                                        {/* Activity Item 1 */}
                                        <div className="flex gap-sm">
                                            <div className="w-8 h-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center shrink-0 z-10 ring-4 ring-surface">
                                                <Banknote size={16} className="text-success text-[16px]" />
                                            </div>
                                            <div className="pt-1">
                                                <div className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Pembayaran diterima</span> dari Toko Makmur</div>
                                                <div className="font-data-sm text-data-sm text-success mt-0.5 font-medium">+ Rp 450.000</div>
                                                <div className="font-caption text-caption text-text-muted mt-1">10 minutes ago</div>
                                            </div>
                                        </div>

                                        {/* Activity Item 2 */}
                                        <div className="flex gap-sm">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 z-10 ring-4 ring-surface">
                                                <Package size={16} className="text-primary text-[16px]" />
                                            </div>
                                            <div className="pt-1">
                                                <div className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Stok baru ditambahkan</span> ke Gudang Utama</div>
                                                <div className="font-caption text-caption text-text-secondary mt-0.5 border border-outline-variant rounded p-2 bg-surface-bright mt-1">
                                                    24x Keripik Tempe, 12x Susu Murni
                                                </div>
                                                <div className="font-caption text-caption text-text-muted mt-1">2 hours ago</div>
                                            </div>
                                        </div>

                                        {/* Activity Item 3 */}
                                        <div className="flex gap-sm">
                                            <div
                                                className="w-8 h-8 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0 z-10 ring-4 ring-surface"
                                                style={{ borderColor: "hsla(38, 92%, 50%, 0.2)", backgroundColor: "hsla(38, 92%, 50%, 0.1)" }}
                                            >
                                                <Store
                                                    size={16}
                                                    className="text-warning text-[16px]"
                                                    style={{ color: "hsl(38 92% 50%)" }}
                                                />
                                            </div>
                                            <div className="pt-1">
                                                <div className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Toko Baru</span> mendaftar: Warung Sederhana</div>
                                                <div className="font-caption text-caption text-text-muted mt-1">Yesterday at 14:30</div>
                                            </div>
                                        </div>

                                        {/* Activity Item 4 */}
                                        <div className="flex gap-sm">
                                            <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center shrink-0 z-10 ring-4 ring-surface">
                                                <Truck size={16} className="text-text-secondary text-[16px]" />
                                            </div>
                                            <div className="pt-1">
                                                <div className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Kunjungan rutin</span> diselesaikan oleh <span className="text-primary cursor-pointer">Andi</span></div>
                                                <div className="font-caption text-caption text-text-muted mt-1">Yesterday at 09:15</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 border-t border-outline-variant text-center">
                                    <button className="text-primary font-body-sm text-body-sm font-medium hover:underline">
                                        Load More Activity
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Scoped Styles for background pattern */}
            <style>{`
        .chart-bg {
          background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: bottom left;
        }
      `}</style>
        </div>
    );
}