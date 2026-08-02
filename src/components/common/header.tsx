import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
	{ label: "ই-কমার্স", href: "/shop" },
	{ label: "SMS", href: "/sms" },
	{ label: "ফিচারসমূহ", section: "features" },
	{ label: "বিস্তারিত", section: "details" },
	{ label: "প্যাকেজ", section: "packages" },
	{ label: "Login", to: "/login" },
] as const;

type NavItem = (typeof NAV_ITEMS)[number];

const linkClasses =
	"text-sm font-medium text-secondary transition-colors hover:text-secondary/70";

function NavItemLink({
	item,
	onNavigate,
	onSectionClick,
}: {
	item: NavItem;
	onNavigate?: () => void;
	onSectionClick?: (id: string) => void;
}) {
	if ("to" in item) {
		return (
			<Link
				to={item.to}
				onClick={onNavigate}
				className={linkClasses}
				activeProps={{
					className: "font-semibold underline underline-offset-4",
				}}
			>
				{item.label}
			</Link>
		);
	}
	if ("href" in item) {
		return (
			<a href={item.href} onClick={onNavigate} className={linkClasses}>
				{item.label}
			</a>
		);
	}
	return (
		<a
			href={`/#${item.section}`}
			onClick={(e) => {
				e.preventDefault();
				onSectionClick?.(item.section);
			}}
			className={linkClasses}
		>
			{item.label}
		</a>
	);
}

const Header = () => {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const drawerRef = useRef<HTMLElement>(null);
	const navigate = useNavigate();

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

	const scrollToSection = (id: string) => {
		close();
		if (window.location.pathname === "/") {
			document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
			return;
		}
		navigate({ to: "/", hash: id, hashScrollIntoView: { behavior: "smooth" } });
	};

	return (
		<header className="text-secondary">
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
						<NavItemLink
							key={item.label}
							item={item}
							onSectionClick={scrollToSection}
						/>
					))}
				</nav>

				<button
					type="button"
					ref={triggerRef}
					onClick={() => setOpen(true)}
					className="md:hidden p-2 -mr-2 rounded-md text-secondary hover:bg-secondary/10 transition-colors"
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
				className={`fixed inset-0 z-40 bg-primary/50 transition-opacity duration-300 md:hidden ${
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
				className={`fixed inset-y-0 left-0 z-50 w-72 bg-white text-secondary shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between px-4 py-4 border-b border-secondary/10">
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
						className="p-2 rounded-md hover:bg-secondary/10 transition-colors"
						aria-label="Close menu"
					>
						<X className="h-6 w-6" />
					</button>
				</div>
				<nav className="flex flex-col gap-5 px-4 py-6">
					{NAV_ITEMS.map((item) => (
						<NavItemLink
							key={item.label}
							item={item}
							onNavigate={close}
							onSectionClick={scrollToSection}
						/>
					))}
				</nav>
			</aside>
		</header>
	);
};

export default Header;
