// @ts-nocheck
import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/userContext";

const NAV_ITEMS = [
	{ label: "যেভাবে কাজ করে", section: "how" },
	{ label: "ফিচারসমূহ", section: "features" },
	{ label: "বিনামূল্যে ব্যবহার", section: "free" },
	{ label: "মূল্যতালিকা", section: "pricing" },
	{ label: "সাধারণ প্রশ্ন", section: "faq" },
];

const linkClasses =
	"text-sm font-medium text-white/75 transition-colors hover:text-white";

const authBtnClasses =
	"inline-flex items-center gap-2 rounded-[10px] border border-[#3DDC97]/50 bg-gradient-to-b from-[#0F7A52] to-[#0A5138] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_18px_rgba(61,220,151,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(61,220,151,0.5)]";

const loginLinkClasses =
	"text-sm font-medium text-white/75 transition-colors hover:text-white";

/* shield logo with gold parcel — custom SVG matching the courierByte brand */
function ShieldLogo({ className = "" }) {
	return (
		<svg
			viewBox="0 0 40 44"
			className={className}
			aria-hidden="true"
			fill="none"
		>
			<defs>
				<linearGradient id="cbShieldFill" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#0E2C24" />
					<stop offset="1" stopColor="#081A20" />
				</linearGradient>
				<linearGradient id="cbShieldStroke" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#2FD28F" />
					<stop offset="1" stopColor="#0F7D51" />
				</linearGradient>
			</defs>
			<path
				d="M20 2 36 8.2V22c0 10.8-6.9 17.6-16 19.8C10.9 39.6 4 32.8 4 22V8.2Z"
				fill="url(#cbShieldFill)"
				stroke="url(#cbShieldStroke)"
				strokeWidth="2.4"
				strokeLinejoin="round"
			/>
			<polygon
				points="20,10 30,15 20,20 10,15"
				fill="#F6C45B"
				stroke="#F6C45B"
				strokeWidth="1.4"
				strokeLinejoin="round"
			/>
			<polygon
				points="10,15 20,20 20,32 10,27"
				fill="#E8A83B"
				stroke="#E8A83B"
				strokeWidth="1.4"
				strokeLinejoin="round"
			/>
			<polygon
				points="30,15 20,20 20,32 30,27"
				fill="#C9862B"
				stroke="#C9862B"
				strokeWidth="1.4"
				strokeLinejoin="round"
			/>
			<polygon points="10,21 20,26 20,28.4 10,23.4" fill="#B5761F" />
			<polygon points="30,21 20,26 20,28.4 30,23.4" fill="#9C661A" />
		</svg>
	);
}

function Wordmark({ className = "" }) {
	return (
		<span className={`font-extrabold tracking-tight text-white ${className}`}>
			courier<span className="text-accent">Byte</span>
		</span>
	);
}

function NavItemLink({ item, onSectionClick }) {
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

function AuthButton({ onClick }) {
	const { isAuthenticated, user } = useAuth();
	const panelPath =
		user?.role === "admin" || user?.role === "super_admin"
			? "/admin"
			: "/panel";

	if (isAuthenticated) {
		return (
			<Link to={panelPath} onClick={onClick} className={authBtnClasses}>
				<LayoutDashboard className="h-3.5 w-3.5" />
				ড্যাশবোর্ড
			</Link>
		);
	}

	return (
		<div className="flex items-center gap-2 sm:gap-3">
			<Link to="/login" onClick={onClick} className={loginLinkClasses}>
				লগইন
			</Link>
			<Link to="/login" onClick={onClick} className={authBtnClasses}>
				শুরু করুন
			</Link>
		</div>
	);
}

const Header = () => {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef(null);
	const drawerRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!open) return;
		const onKey = (e) => e.key === "Escape" && setOpen(false);
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
		const onViewportChange = (e) => e.matches && setOpen(false);
		mq.addEventListener("change", onViewportChange);
		return () => mq.removeEventListener("change", onViewportChange);
	}, []);

	const close = () => setOpen(false);

	const scrollToSection = (id) => {
		close();
		if (window.location.pathname === "/") {
			document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
			return;
		}
		navigate({ to: "/", hash: id, hashScrollIntoView: { behavior: "smooth" } });
	};

	return (
		<header className="border-b border-white/5 bg-night text-white">
			<div className="maxw px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
				<Link to="/" className="flex shrink-0 items-center gap-2.5">
					<ShieldLogo className="h-10 w-10 shrink-0" />
					<Wordmark className="text-[21px]" />
				</Link>

				<nav className="hidden md:flex items-center gap-6">
					{NAV_ITEMS.map((item) => (
						<NavItemLink
							key={item.label}
							item={item}
							onSectionClick={scrollToSection}
						/>
					))}
					<AuthButton />
				</nav>

				<button
					type="button"
					ref={triggerRef}
					onClick={() => setOpen(true)}
					className="md:hidden p-2 -mr-2 rounded-md text-white hover:bg-white/10 transition-colors"
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
				className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
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
				className={`fixed inset-y-0 left-0 z-50 w-72 bg-night-soft text-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between px-4 py-4 border-b border-secondary/10">
					<Link
						to="/"
						onClick={close}
						className="flex shrink-0 items-center gap-2.5"
					>
						<ShieldLogo className="h-9 w-9 shrink-0" />
						<Wordmark className="text-lg" />
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
						<NavItemLink
							key={item.label}
							item={item}
							onSectionClick={scrollToSection}
						/>
					))}
					<hr className="border-white/10" />
					<AuthButton onClick={close} />
				</nav>
			</aside>
		</header>
	);
};

export default Header;
