// @ts-nocheck
import { Link, useNavigate } from "@tanstack/react-router";
import {
	Code2,
	Gem,
	LayoutDashboard,
	LogOut,
	Menu,
	MessageSquare,
	PackageSearch,
	Receipt,
	ShieldCheck,
	UserRound,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/userContext";

// These `to` paths map to the panel routes defined under src/routes/panel/.
const MAIN_NAV = [
	{ label: "Dashboard", to: "/panel", icon: LayoutDashboard },
	{ label: "Fraud Checker", to: "/panel/fraud-checker", icon: ShieldCheck },
	{ label: "Subscription Plans", to: "/panel/subscription-plans", icon: Gem },
	{ label: "Billing", to: "/panel/billing", icon: Receipt },
	{ label: "Developer API", to: "/panel/developer-api", icon: Code2 },
];

const ACCOUNT_NAV = [
	{ label: "Profile", to: "/panel/profile", icon: UserRound },
	{ label: "Feedback", to: "/panel/feedback", icon: MessageSquare },
];

const navLinkClasses =
	"group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-secondary transition-all duration-200 hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30 data-[status=active]:bg-secondary/30 data-[status=active]:font-bold data-[status=active]:text-secondary-dark data-[status=active]:hover:bg-secondary/30";

function NavItemLink({ item, onNavigate }) {
	return (
		<Link
			to={item.to}
			activeOptions={{ exact: true }}
			onClick={onNavigate}
			className={navLinkClasses}
		>
			<span
				aria-hidden="true"
				className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-secondary-dark opacity-0 transition-opacity duration-200 group-data-[status=active]:opacity-100"
			/>
			<item.icon className="h-5 w-5 shrink-0" />
			<span className="truncate">{item.label}</span>
		</Link>
	);
}

const sectionLabel =
	"mb-2 px-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-secondary/50";

function Brand({ onClick }) {
	return (
		<Link to="/" onClick={onClick} className="flex items-center gap-3">
			<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary-dark text-white shadow-md shadow-secondary/25">
				<PackageSearch className="h-5 w-5" />
			</span>
			<span className="flex flex-col leading-tight">
				<span className="text-lg font-extrabold tracking-tight text-secondary-dark">
					কুরিয়ারবাইট
				</span>
				<span className="text-xs font-medium text-secondary/60">
					User Panel
				</span>
			</span>
		</Link>
	);
}

function SidebarContent({ onNavigate }) {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		onNavigate?.();
		await logout();
		await navigate({ to: "/login" });
	};

	return (
		<div className="flex h-full flex-col">
			<nav
				aria-label="Main navigation"
				className="flex-1 space-y-6 overflow-y-auto px-3"
			>
				<div>
					<p className={sectionLabel}>Main</p>
					<div className="space-y-1">
						{MAIN_NAV.map((item) => (
							<NavItemLink key={item.to} item={item} onNavigate={onNavigate} />
						))}
					</div>
				</div>

				<div>
					<p className={sectionLabel}>Account</p>
					<div className="space-y-1">
						{ACCOUNT_NAV.map((item) => (
							<NavItemLink key={item.to} item={item} onNavigate={onNavigate} />
						))}
					</div>
				</div>
			</nav>

			<div className="border-t border-secondary/10 p-3">
				<button
					type="button"
					onClick={handleLogout}
					className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-600 transition-all duration-200 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
				>
					<LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
					Logout
				</button>
			</div>
		</div>
	);
}

export const Sidebar = () => {
	const [open, setOpen] = useState(false);
	const drawerRef = useRef(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (e) => e.key === "Escape" && setOpen(false);
		document.body.style.overflow = "hidden";
		drawerRef.current?.focus();
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
		};
	}, [open]);

	// Close the drawer when the viewport grows to desktop size
	useEffect(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const onViewportChange = (e) => e.matches && setOpen(false);
		mq.addEventListener("change", onViewportChange);
		return () => mq.removeEventListener("change", onViewportChange);
	}, []);

	const close = () => setOpen(false);

	return (
		<>
			{/* Desktop sidebar */}
			<aside className="hidden shrink-0 border-r border-secondary/10 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col">
				<div className="px-4 pb-5 pt-6">
					<Brand />
				</div>
				<SidebarContent />
			</aside>

			{/* Mobile top bar — hidden while the drawer is open so the brand doesn't repeat */}
			<header
				className={`sticky top-0 z-40 flex items-center justify-between border-b border-secondary/10 bg-white/95 px-4 py-3 backdrop-blur transition-opacity duration-300 lg:hidden ${
					open ? "pointer-events-none opacity-0" : "opacity-100"
				}`}
			>
				<Brand onClick={close} />
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="rounded-lg p-2 text-secondary transition-colors hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30"
					aria-label="Open menu"
					aria-expanded={open}
					aria-controls="user-drawer"
				>
					<Menu className="h-6 w-6" />
				</button>
			</header>

			{/* Backdrop */}
			<div
				onClick={close}
				aria-hidden="true"
				className={`fixed inset-0 z-40 bg-secondary-dark/30 transition-opacity duration-300 lg:hidden ${
					open ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>

			{/* Mobile drawer */}
			<aside
				id="user-drawer"
				ref={drawerRef}
				tabIndex={-1}
				inert={!open}
				aria-hidden={!open}
				className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between px-4 py-3">
					<Brand onClick={close} />
					<button
						type="button"
						onClick={close}
						className="rounded-lg p-2 text-secondary transition-colors hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30"
						aria-label="Close menu"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				<SidebarContent onNavigate={close} />
			</aside>
		</>
	);
};
