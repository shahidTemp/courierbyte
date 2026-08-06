// @ts-nocheck
import { Link, useNavigate } from "@tanstack/react-router";
import {
	LogOut,
	MessageCircle,
	PackageSearch,
	ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/userContext";

// Activation support WhatsApp number (local BD format)
const WHATSAPP_NUMBER = "01993847746";
// wa.me links use the international format: 880 + number without the leading 0
const WHATSAPP_LINK = `https://wa.me/880${WHATSAPP_NUMBER.slice(1)}`;

export const AccountInactive = () => {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		await navigate({ to: "/login" });
	};

	return (
		<div className="flex min-h-screen items-center justify-center px-4 py-12">
			<div className="w-full max-w-md animate-fade-in-up">
				<Link to="/" className="mb-8 flex items-center justify-center gap-3">
					<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark text-white shadow-lg shadow-secondary/25">
						<PackageSearch className="h-6 w-6" />
					</span>
					<span className="text-2xl font-extrabold tracking-tight text-secondary-dark">
						কুরিয়ারবাইট
					</span>
				</Link>

				<div className="rounded-3xl border border-secondary/10 bg-white p-8 text-center shadow-xl shadow-secondary/10 sm:p-10">
					<span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
						<ShieldAlert className="h-8 w-8" />
					</span>

					<h1 className="mt-6 text-2xl font-extrabold tracking-tight text-secondary-dark">
						আপনার অ্যাকাউন্ট সক্রিয় হয়নি
					</h1>

					<p className="mt-3 text-sm leading-relaxed text-secondary/70">
						আপনার অ্যাকাউন্টটি এখনো অনুমোদন করা হয়নি। অ্যাকাউন্টটি সক্রিয় করতে নিচের
						WhatsApp বাটনে ক্লিক করে আমাদের সাথে যোগাযোগ করুন।
					</p>

					<a
						href={WHATSAPP_LINK}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1fb959] hover:shadow-xl hover:shadow-[#25D366]/40 active:scale-95"
					>
						<MessageCircle className="h-5 w-5 shrink-0" />
						<span>WhatsApp এ যোগাযোগ করুন</span>
						<span className="font-semibold text-white/85">
							({WHATSAPP_NUMBER})
						</span>
					</a>

					<div className="mt-8 flex items-center gap-3">
						<span className="h-px flex-1 bg-secondary/10" />
						<span className="text-xs font-medium text-secondary/40">অথবা</span>
						<span className="h-px flex-1 bg-secondary/10" />
					</div>

					<button
						type="button"
						onClick={handleLogout}
						className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-secondary/20 bg-white px-6 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30"
					>
						<LogOut className="h-4 w-4 shrink-0" />
						লগ আউট করুন
					</button>
				</div>

				<p className="mt-6 text-center text-xs text-secondary/50">
					আমাদের সাপোর্ট টিম আপনার অ্যাকাউন্ট যাচাই করে দ্রুত সক্রিয় করে দেবে।
				</p>
			</div>
		</div>
	);
};
