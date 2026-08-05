import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader } from "@/components/common/loader";
import { useAuth } from "@/context/userContext";

export const Route = createFileRoute("/subscription")({
	component: SubscriptionPage,
});

function SubscriptionPage() {
	const { isLoading, isAuthenticated } = useAuth();

	if (isLoading) return <Loader />;
	if (!isAuthenticated) return <Navigate to="/login" />;

	return <SubscriptionCard />;
}

export default function SubscriptionCard({
	packageName = "Professional",
	packageAmount = "৬০০",
	bkashNumber = "01911970156",
	actionUrl = "https://zachaikori.com/user/subscription-request",
	csrfToken = "fnDzGMeT5wFaaQAxmHTieyu0MC3T5R4fidfFuMkY",
	testValue = "eyJpdiI6InJlejBYM2JGMU11eVgwQWhDeWU3WWc9PSIsInZhbHVlIjoid1BaeCtRSDZHVzBYU3cxZFYrclVBZz09IiwibWFjIjoiYWNlNGNkMGY0N2ZjZDQ4NzUzNGM4MDBhMjlmNTgwM2MzMDUzOWM4Mjc3ZDlhZmM0ODMxMjg2MzZiNDE5YTkwNyIsInRhZyI6IiJ9",
}) {
	const [copied, setCopied] = useState(false);
	const [formData, setFormData] = useState({
		transactionId: "",
		amount: "",
		senderNumber: "",
	});

	const handleCopy = () => {
		navigator.clipboard.writeText(bkashNumber);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const whatsappUrl = `https://wa.me/+88${bkashNumber}?text=${encodeURIComponent(
		`আমি আপনাদের ${packageName} প্যাকেজটি নিতে আগ্রহী`,
	)}`;

	return (
		<div
			id="subscriptionCard"
			className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
		>
			<div className="grid grid-cols-1 md:grid-cols-5">
				{/* Left Section: bKash Info & QR */}
				<section className="md:col-span-2 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-pink-600 to-pink-800 px-5 py-8 text-white sm:px-7">
					<span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs font-semibold">
						<img
							src="https://zachaikori.com/images/bksh.webp"
							alt="bkash"
							className="h-4 w-4"
						/>
						<span>bKash Payment</span>
					</span>

					<div className="rounded-2xl bg-white p-3 shadow-2xl">
						<img
							src="https://zachaikori.com/images/bkashqr.jpg"
							alt="bKash QR"
							className="w-full max-w-[190px]"
						/>
					</div>

					<p className="text-center text-xs text-white/85">
						QR কোড স্ক্যান করে সহজেই পেমেন্ট করুন
					</p>

					<div className="flex w-full items-center gap-2 rounded-xl border border-dashed border-white/50 bg-white/10 p-2.5">
						<span
							id="bkashNumber"
							className="flex-1 text-xl font-bold tracking-wide"
						>
							{bkashNumber}
						</span>
						<button
							id="copyBtn"
							type="button"
							onClick={handleCopy}
							className="rounded-lg border border-white/45 bg-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/30"
						>
							{copied ? "✓ কপি হয়েছে" : "📋 কপি"}
						</button>
					</div>

					<a
						id="whatsappBtn"
						href={whatsappUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-600"
					>
						<svg
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="15"
							height="15"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"></path>
						</svg>
						<span>WhatsApp এ যোগাযোগ করুন</span>
					</a>

					<div id="alert-placeholder" className="w-full"></div>
				</section>

				{/* Right Section: Instructions & Form */}
				<section className="md:col-span-3 px-4 py-6 sm:px-7">
					<div className="mb-4 border-b border-slate-200 pb-4">
						<span className="mb-2 inline-flex rounded-full border border-pink-600 bg-pink-50 px-3 py-1 text-xs font-bold text-pink-600">
							<span className="package-name">{packageName}</span>&nbsp;প্যাকেজ
						</span>
						<h2 className="text-xl font-extrabold text-slate-900">
							bKash এ পেমেন্ট করুন
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							মোট পরিমাণ:{" "}
							<strong className="package-amount text-base text-pink-600">
								৳ {packageAmount}
							</strong>
						</p>
					</div>

					<div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
						<p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
							পেমেন্ট নির্দেশনা
						</p>
						<ol className="space-y-2 text-sm text-slate-700">
							<li className="flex gap-2">
								<span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
									1
								</span>
								<span>
									bKash অ্যাপ খুলুন — QR স্ক্যান বা <strong>Send Money</strong> নির্বাচন
									করুন।
								</span>
							</li>
							<li className="flex gap-2">
								<span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
									2
								</span>
								<span>
									নম্বর <strong className="text-pink-600">{bkashNumber}</strong>{" "}
									ব্যবহার করুন।
								</span>
							</li>
							<li className="flex gap-2">
								<span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
									3
								</span>
								<span>
									Amount হিসেবে{" "}
									<strong className="package-amount text-pink-600">
										৳ {packageAmount}
									</strong>{" "}
									টাকা লিখুন।
								</span>
							</li>
							<li className="flex gap-2">
								<span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
									4
								</span>
								<span>PIN দিয়ে পেমেন্ট কনফার্ম করুন।</span>
							</li>
							<li className="flex gap-2">
								<span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
									5
								</span>
								<span>
									<strong>Transaction ID</strong> নোট করে নিচের ফর্মে পূরণ করুন।
								</span>
							</li>
						</ol>
					</div>

					<form
						id="transactionForm"
						action={actionUrl}
						method="POST"
						className="space-y-3"
					>
						<input
							type="hidden"
							name="_token"
							value={csrfToken}
							autoComplete="off"
						/>
						<input
							type="hidden"
							name="test_value"
							id="test_value"
							value={testValue}
						/>
						<input type="hidden" name="modal" value="false" />

						<div>
							<label
								htmlFor="transactionId"
								className="mb-1.5 block text-sm font-semibold text-slate-700"
							>
								Transaction ID
							</label>
							<input
								type="text"
								id="transactionId"
								name="transaction_id"
								value={formData.transactionId}
								onChange={handleChange}
								placeholder="যেমন: 8FG3K2H1P9"
								required
								className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
							/>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div>
								<label
									htmlFor="amount"
									className="mb-1.5 block text-sm font-semibold text-slate-700"
								>
									Amount (৳)
								</label>
								<input
									type="number"
									id="amount"
									name="amount"
									value={formData.amount}
									onChange={handleChange}
									placeholder="যেমন: 500"
									required
									className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
								/>
							</div>
							<div>
								<label
									htmlFor="senderNumber"
									className="mb-1.5 block text-sm font-semibold text-slate-700"
								>
									Sender Number
								</label>
								<input
									type="text"
									id="senderNumber"
									name="sender_number"
									value={formData.senderNumber}
									onChange={handleChange}
									placeholder="01XXXXXXXXX"
									required
									className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
								/>
							</div>
						</div>

						<button
							type="submit"
							className="mt-2 w-full rounded-xl bg-gradient-to-r from-pink-600 to-pink-700 px-4 py-3 text-sm font-bold text-white transition hover:from-pink-700 hover:to-pink-800"
						>
							পেমেন্ট সাবমিট করুন
						</button>
					</form>
				</section>
			</div>
		</div>
	);
}
