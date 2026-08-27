// @ts-nocheck
import { Link } from "@tanstack/react-router";
import {
	Facebook,
	Instagram,
	Mail,
	MapPin,
	MessageCircle,
	Phone,
	Video,
	Youtube,
} from "lucide-react";

const usefulLinks = [
	{ name: "প্রশ্নাবলী", url: "/faq" },
	{ name: "শর্তাবলী", url: "/term-condition" },
	{ name: "গোপনীয়তা নীতি", url: "/privacy-policy" },
	{ name: "ফেরত নীতি", url: "/return-policy" },
	{ name: "আমাদের সম্পর্কে", url: "/about-us" },
];

// Static configuration for কুরিয়ারবাইট
const dummyData = {
	general: {
		name: "কুরিয়ারবাইট (CourierByte)",
		description:
			"কুরিয়ারবাইট বাংলাদেশের ই-কমার্স ব্যবসার জন্য কুরিয়ার হিস্ট্রি চেকিং প্ল্যাটফর্ম। প্যাকেজ অন ডেলিভারি পাঠানোর আগে কাস্টমারের পার্সেল হিস্ট্রি ও সাকসেস রেশিও যাচাই করে COD লোকসান এড়ান।",
		logo: "", // Leave blank to fallback to text
	},
	contact: {
		address: "লেভেল-০, লেইন-১, ব্লক-এ, হালিশহর, চট্টগ্রাম, বাংলাদেশ",
		phone1: "01891-614300",
		phone2: "01688-444555",
		email: "business.appbyte@gmail.com",
		whatsapp1: "+8801891614300",
		whatsapp2: "+8801688444555",
	},
	// ⚠️ TODO: সত্যিকারের সোশ্যাল মিডিয়া লিংক বসান
	socials: {
		fb: "https://facebook.com/appbyte",
		insta: "https://instagram.com/appbyte",
		youtube: "https://youtube.com/@appbyte",
		tiktok: "https://tiktok.com/@appbyte",
	},
};

const formatWhatsAppNumber = (num) => {
	if (!num) return "";
	const digits = num.replace(/\D/g, "");
	if (digits.startsWith("88")) return digits;
	return `88${digits}`;
};

const Footer = () => {
	const { general, contact, socials } = dummyData;

	const socialLinks = [
		{ key: "fb", url: socials.fb, Icon: Facebook, bg: "bg-secondary" },
		{
			key: "insta",
			url: socials.insta,
			Icon: Instagram,
			bg: "bg-gradient-to-tr from-secondary/70 via-secondary to-secondary-dark",
		},
		{ key: "youtube", url: socials.youtube, Icon: Youtube, bg: "bg-secondary-dark" },
		{
			key: "tiktok",
			url: socials.tiktok,
			Icon: Video,
			bg: "bg-secondary-dark border border-secondary/30",
		},
	];

	return (
		<footer className="bg-night text-white/60 font-sans">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				{/* Contact Section */}
				<div className="border-b border-white/10 py-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Address */}
						<div className="flex items-start gap-4">
							<MapPin size={24} className="mt-1 shrink-0 text-white" />
							<div>
								<h4 className="text-white text-lg font-semibold mb-1">
									আমাদের ঠিকানা
								</h4>
								<span className="text-sm">
									{contact.address || "ঠিকানা যোগ করা হয়নি"}
								</span>
							</div>
						</div>

						{/* Phone */}
						<div className="flex items-start gap-4">
							<Phone size={24} className="mt-1 shrink-0 text-white" />
							<div>
								<h4 className="text-white text-lg font-semibold mb-1">
									আমাদের কল করুন
								</h4>
								<p className="text-sm flex flex-wrap gap-1">
									{contact.phone1 ? (
										<a
											href={`tel:${contact.phone1}`}
											className="hover:text-white transition-colors"
										>
											{contact.phone1}
										</a>
									) : (
										<span>ফোন নম্বর যোগ করা হয়নি</span>
									)}
									{contact.phone2 && contact.phone1 && <span>,</span>}
									{contact.phone2 && (
										<a
											href={`tel:${contact.phone2}`}
											className="hover:text-white transition-colors"
										>
											{contact.phone2}
										</a>
									)}
								</p>
							</div>
						</div>

						{/* Email */}
						<div className="flex items-start gap-4">
							<Mail size={24} className="mt-1 shrink-0 text-white" />
							<div>
								<h4 className="text-white text-lg font-semibold mb-1">
									আমাদের ইমেইল করুন
								</h4>
								<p className="text-sm">
									{contact.email ? (
										<a
											href={`mailto:${contact.email}`}
											className="hover:text-white transition-colors"
										>
											{contact.email}
										</a>
									) : (
										<span>ইমেইল যোগ করা হয়নি</span>
									)}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer Content */}
				<div className="py-12">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
						{/* Brand Logo & Social Links */}
						<div className="space-y-6">
							<Link to="/">
								{general.logo ? (
									<img
										src={general.logo}
										className="h-12 w-auto object-contain"
										alt={general.name}
										loading="lazy"
									/>
								) : (
									<span className="text-white text-xl font-bold">
										{general.name}
									</span>
								)}
							</Link>
							<p className="text-sm leading-relaxed max-w-md">
								{general.description}
							</p>

							{/* Social Follow Section */}
							<div className="space-y-3">
								<span className="text-white font-medium block text-sm">
									আমাদের অনুসরণ করুন
								</span>
								<div className="flex flex-wrap items-center gap-3">
									{socialLinks.map(({ key, url, Icon, bg }) => (
										<a
											key={key}
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											className={`w-10 h-10 rounded-full ${bg} text-white flex items-center justify-center hover:opacity-90 transition-opacity`}
										>
											<Icon size={20} />
										</a>
									))}
									{formatWhatsAppNumber(contact.whatsapp1) && (
										<a
											href={`https://wa.me/${formatWhatsAppNumber(contact.whatsapp1)}`}
											target="_blank"
											rel="noopener noreferrer"
											className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:opacity-90 transition-opacity"
										>
											<MessageCircle size={20} />
										</a>
									)}
									{formatWhatsAppNumber(contact.whatsapp2) && (
										<a
											href={`https://wa.me/${formatWhatsAppNumber(contact.whatsapp2)}`}
											target="_blank"
											rel="noopener noreferrer"
											className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:opacity-90 transition-opacity"
										>
											<MessageCircle size={20} />
										</a>
									)}
								</div>
							</div>
						</div>

						{/* Useful Links Widget */}
						<div>
							<h3 className="text-white text-lg font-semibold border-b border-secondary/70 pb-2 inline-block mb-6">
								দরকারী লিঙ্কসমূহ
							</h3>
							<ul className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
								{usefulLinks.map((link) => (
									<li key={link.url}>
										<Link
											to={link.url}
											className="hover:text-white transition-colors"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Copyright Area */}
			<div className="border-t border-white/5 bg-night py-4 text-center">
				<div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm">
					<span>
						&copy; {new Date().getFullYear()} কুরিয়ারবাইট (CourierByte). All rights
						reserved.
					</span>
					<span className="hidden sm:inline">|</span>
					<div className="flex items-center gap-2">
						<span>
							Developed By{" "}
							<a
								href="https://appbyte.net"
								target="_blank"
								rel="noopener noreferrer"
								className="text-white/80 hover:underline"
							>
								AppByte
							</a>
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
