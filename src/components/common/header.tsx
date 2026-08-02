import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
	{ label: "Home", to: "/" },
	{ label: "ই-কমার্স", href: "/shop" },
	{ label: "SMS", href: "/sms" },
	{ label: "Pricing", href: "/pricing" },
	{ label: "Login", to: "/login" },
] as const;

type NavItem = (typeof NAV_ITEMS)[number];

const linkClasses =
	"text-sm font-medium transition-colors hover:text-[#ff5e14]";

function NavItemLink({
	item,
	onNavigate,
}: {
	item: NavItem;
	onNavigate?: () => void;
}) {
	if ("to" in item) {
		return (
			<Link
				to={item.to}
				onClick={onNavigate}
				className={linkClasses}
				activeProps={{ className: "text-[#ff5e14]" }}
			>
				{item.label}
			</Link>
		);
	}
	return (
		<a href={item.href} onClick={onNavigate} className={linkClasses}>
			{item.label}
		</a>
	);
}

const Header = () => {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const drawerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
		document.body.style.overflow = "hidden";
		drawerRef.current?.focus();
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
			triggerRef.current?.focus();
		};
	}, [open]);

	// Close the drawer when the viewport grows to desktop size
	useEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		const onViewportChange = (e: MediaQueryListEvent) =>
			e.matches && setOpen(false);
		mq.addEventListener("change", onViewportChange);
		return () => mq.removeEventListener("change", onViewportChange);
	}, []);

	const close = () => setOpen(false);

	return (
		<header className="bg-[#151414] text-white">
			<div className="maxw px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
				<Link to="/" className="shrink-0">
					<img
						src="https://appbyte.net/images/logo.png"
						alt="Arazshop"
						className="h-10 w-auto"
					/>
				</Link>

				<nav className="hidden md:flex items-center gap-6">
					{NAV_ITEMS.map((item) => (
						<NavItemLink key={item.label} item={item} />
					))}
				</nav>

				<button
					type="button"
					ref={triggerRef}
					onClick={() => setOpen(true)}
					className="md:hidden p-2 -mr-2 rounded-md hover:bg-white/10 transition-colors"
					aria-label="Open menu"
					aria-expanded={open}
					aria-controls="mobile-nav"
				>
					<Menu className="h-6 w-6" />
				</button>
			</div>

			{/* Backdrop */}
			<div
				onClick={close}
				aria-hidden="true"
				className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
					open ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			/>

			{/* Left drawer */}
			<aside
				id="mobile-nav"
				ref={drawerRef}
				tabIndex={-1}
				inert={!open}
				aria-hidden={!open}
				className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#151414] text-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
					<Link to="/" onClick={close} className="shrink-0">
						<img
							src="https://appbyte.net/images/logo.png"
							alt="Arazshop"
							className="h-9 w-auto"
						/>
					</Link>
					<button
						type="button"
						onClick={close}
						className="p-2 rounded-md hover:bg-white/10 transition-colors"
						aria-label="Close menu"
					>
						<X className="h-6 w-6" />
					</button>
				</div>
				<nav className="flex flex-col gap-5 px-4 py-6">
					{NAV_ITEMS.map((item) => (
						<NavItemLink key={item.label} item={item} onNavigate={close} />
					))}
				</nav>
			</aside>
		</header>
	);
};

export default Header;
