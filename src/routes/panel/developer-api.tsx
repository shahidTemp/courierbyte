// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import {
	Check,
	CheckCircle2,
	Clipboard,
	Code2,
	Copy,
	ExternalLink,
	KeyRound,
	Server,
	ShieldCheck,
	Terminal,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/panel/developer-api")({
	component: RouteComponent,
});

const API_ENDPOINT = "https://your-domain.com/api/v1/courier-check";

const examples = [
	{
		id: "curl",
		label: "cURL",
		language: "bash",
		code: `curl -X POST ${API_ENDPOINT} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone":"01712345678"}'`,
	},
	{
		id: "php",
		label: "PHP",
		language: "php",
		code: `$ch = curl_init("${API_ENDPOINT}");

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer YOUR_API_KEY",
        "Content-Type: application/json",
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "phone" => "01712345678",
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`,
	},
	{
		id: "node",
		label: "Node.js",
		language: "javascript",
		code: `const response = await fetch("${API_ENDPOINT}", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ phone: "01712345678" }),
});

const result = await response.json();
console.log(result);`,
	},
	{
		id: "python",
		label: "Python",
		language: "python",
		code: `import requests

response = requests.post(
    "${API_ENDPOINT}",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={"phone": "01712345678"},
)

print(response.json())`,
	},
	{
		id: "react",
		label: "React",
		language: "jsx",
		code: `// Use this in a server-side React handler, not in browser code.
import axios from "axios";

const API_KEY = "YOUR_API_KEY";

export async function checkCourier(phone) {
  const { data } = await axios.post(
    "${API_ENDPOINT}",
    { phone },
    {
      headers: {
        Authorization: \`Bearer \${API_KEY}\`,
      },
    },
  );

  return data;
}

// Example: await checkCourier("01712345678");`,
	},
	{
		id: "vue",
		label: "Vue.js",
		language: "javascript",
		code: `<script setup>
// Use this in a server-side Vue/Nuxt handler, not in browser code.
import axios from "axios";

const API_KEY = "YOUR_API_KEY";

async function checkCourier(phone) {
  const { data } = await axios.post(
    "${API_ENDPOINT}",
    { phone },
    {
      headers: {
        Authorization: \`Bearer \${API_KEY}\`,
      },
    },
  );

  return data;
}

// Example: await checkCourier("01712345678");
</script>`,
	},
];

const successResponse = `{
  "success": true,
  "data": {
    "status": "success",
    "total": 10,
    "delivered": 8,
    "cancelled": 2
  }
}`;

const errorResponse = `{
  "success": false,
  "error": "A valid 11-digit phone number is required"
}`;

const errorRows = [
	{
		status: "400",
		label: "Bad Request",
		message: "Invalid JSON or phone number",
	},
	{
		status: "401",
		label: "Unauthorized",
		message: "Missing or invalid API key",
	},
	{ status: "403", label: "Forbidden", message: "No active subscription" },
	{
		status: "429",
		label: "Too Many Requests",
		message: "API call limit reached",
	},
	{
		status: "503",
		label: "Unavailable",
		message: "Courier service is unavailable",
	},
];

function CodeBlock({ code, language, copied, onCopy }) {
	return (
		<div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/10">
			<div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-3">
				<div className="flex items-center gap-2 text-xs font-bold text-slate-400">
					<Terminal aria-hidden="true" className="size-4 text-emerald-400" />
					{language}
				</div>
				<button
					type="button"
					onClick={onCopy}
					className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-bold text-slate-300 transition hover:border-emerald-400/40 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
					aria-label={copied ? "Code copied" : "Copy code"}
				>
					{copied ? (
						<Check aria-hidden="true" className="size-3.5 text-emerald-400" />
					) : (
						<Copy aria-hidden="true" className="size-3.5" />
					)}
					{copied ? "Copied" : "Copy"}
				</button>
			</div>
			<pre className="max-h-[34rem] overflow-auto p-5 text-[13px] leading-6 text-slate-200 sm:p-6 sm:text-sm">
				<code>{code}</code>
			</pre>
		</div>
	);
}

function SectionHeading({ eyebrow, title, children }) {
	return (
		<div className="mb-5">
			<p className="text-xs font-extrabold uppercase tracking-[0.18em] text-secondary">
				{eyebrow}
			</p>
			<h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
				{title}
			</h2>
			{children && (
				<p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
					{children}
				</p>
			)}
		</div>
	);
}

function RouteComponent() {
	const [activeExample, setActiveExample] = useState("curl");
	const [copiedId, setCopiedId] = useState("");
	const selectedExample =
		examples.find((example) => example.id === activeExample) ?? examples[0];

	const copyCode = async (id, code) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedId(id);
			window.setTimeout(() => setCopiedId(""), 1800);
		} catch {
			setCopiedId("");
		}
	};

	return (
		<main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-6xl space-y-8">
				<section className="relative overflow-hidden rounded-3xl border border-secondary/15 bg-white shadow-sm">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-secondary/10 blur-3xl"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-emerald-100/60 blur-3xl"
					/>
					<div className="relative p-6 sm:p-8 lg:p-10">
						<div className="flex flex-wrap items-start justify-between gap-5">
							<div className="flex items-start gap-4">
								<span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark text-white shadow-lg shadow-secondary/25">
									<Code2 aria-hidden="true" className="size-7" />
								</span>
								<div>
									<div className="flex flex-wrap items-center gap-2">
										<h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
											Developer API
										</h1>
										<span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
											v1 · Stable
										</span>
									</div>
									<p className="mt-1 text-sm font-semibold text-secondary/70">
										ডেভেলপার API
									</p>
								</div>
							</div>
							<a
								href="#code-examples"
								className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-secondary/20 transition hover:-translate-y-0.5 hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20"
							>
								<Terminal aria-hidden="true" className="size-4" />
								View examples
							</a>
						</div>
						<p className="mt-6 max-w-3xl text-base leading-7 text-slate-600">
							Check a customer&apos;s courier history from your own website or
							application. Send an 11-digit Bangladeshi mobile number and
							receive a clear courier report.
						</p>
					</div>
				</section>

				<section className="grid gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
							<KeyRound className="size-5" />
						</div>
						<h2 className="font-extrabold text-slate-900">1. Authenticate</h2>
						<p className="mt-1 text-sm leading-6 text-slate-500">
							Send your API key in the Authorization header.
						</p>
					</div>
					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
							<Server className="size-5" />
						</div>
						<h2 className="font-extrabold text-slate-900">2. Send a number</h2>
						<p className="mt-1 text-sm leading-6 text-slate-500">
							Use a valid 11-digit number in a JSON request body.
						</p>
					</div>
					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
							<ShieldCheck className="size-5" />
						</div>
						<h2 className="font-extrabold text-slate-900">
							3. Read the result
						</h2>
						<p className="mt-1 text-sm leading-6 text-slate-500">
							Use the response to make your delivery decision.
						</p>
					</div>
				</section>

				<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<SectionHeading eyebrow="Endpoint" title="Courier check">
						This endpoint uses your API key to check one customer phone number
						at a time.
					</SectionHeading>
					<div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
						<div className="flex min-w-0 items-center gap-3">
							<span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
								POST
							</span>
							<code className="truncate text-sm font-bold text-slate-700">
								/api/v1/courier-check
							</code>
						</div>
						<span className="text-xs font-semibold text-slate-400">
							Content-Type: application/json
						</span>
					</div>
					<div className="mt-5 grid gap-4 lg:grid-cols-2">
						<div className="rounded-2xl border border-slate-200 p-5">
							<h3 className="flex items-center gap-2 font-extrabold text-slate-900">
								<KeyRound className="size-4 text-secondary" /> Authentication
							</h3>
							<p className="mt-2 text-sm leading-6 text-slate-500">
								Replace{" "}
								<code className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-700">
									YOUR_API_KEY
								</code>{" "}
								with the API key from your CourierByte account.
							</p>
							<code className="mt-4 block overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-sm text-emerald-300">
								Authorization: Bearer YOUR_API_KEY
							</code>
						</div>
						<div className="rounded-2xl border border-slate-200 p-5">
							<h3 className="flex items-center gap-2 font-extrabold text-slate-900">
								<Terminal className="size-4 text-secondary" /> Request body
							</h3>
							<p className="mt-2 text-sm leading-6 text-slate-500">
								The phone must contain exactly 11 digits and use a Bangladeshi
								mobile prefix.
							</p>
							<code className="mt-4 block overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-sm text-emerald-300">{`{ "phone": "01712345678" }`}</code>
						</div>
					</div>
				</section>

				<section
					id="code-examples"
					className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
				>
					<SectionHeading eyebrow="Copy and use" title="Code Examples">
						Choose your language, copy the complete example, and replace the API
						key and domain.
					</SectionHeading>
					<div
						role="tablist"
						aria-label="API code examples"
						className="mb-4 flex gap-2 overflow-x-auto border-b border-slate-200 pb-3"
					>
						{examples.map((example) => {
							const isActive = activeExample === example.id;
							return (
								<button
									key={example.id}
									id={`tab-${example.id}`}
									type="button"
									role="tab"
									aria-selected={isActive}
									aria-controls={`panel-${example.id}`}
									onClick={() => setActiveExample(example.id)}
									className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-extrabold transition focus:outline-none focus:ring-2 focus:ring-secondary/30 ${isActive ? "bg-secondary text-white shadow-md shadow-secondary/15" : "text-slate-500 hover:bg-secondary/10 hover:text-secondary"}`}
								>
									{example.label}
								</button>
							);
						})}
					</div>
					<div
						id={`panel-${selectedExample.id}`}
						role="tabpanel"
						aria-labelledby={`tab-${selectedExample.id}`}
					>
						<CodeBlock
							code={selectedExample.code}
							language={selectedExample.language}
							copied={copiedId === selectedExample.id}
							onCopy={() => copyCode(selectedExample.id, selectedExample.code)}
						/>
					</div>
					<p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-400">
						<ExternalLink
							aria-hidden="true"
							className="mt-0.5 size-3.5 shrink-0"
						/>{" "}
						Replace <code className="font-bold">https://your-domain.com</code>{" "}
						with your deployed CourierByte domain. Keep{" "}
						<code className="font-bold">YOUR_API_KEY</code> on your server.
					</p>
				</section>

				<section className="grid gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
						<div className="mb-5 flex items-center gap-3">
							<span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
								<CheckCircle2 className="size-5" />
							</span>
							<div>
								<p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-600">
									200 OK
								</p>
								<h2 className="text-xl font-extrabold text-slate-900">
									Success response
								</h2>
							</div>
						</div>
						<CodeBlock
							code={successResponse}
							language="json"
							copied={copiedId === "success"}
							onCopy={() => copyCode("success", successResponse)}
						/>
						<p className="mt-4 text-sm leading-6 text-slate-500">
							<code className="font-bold text-slate-700">data</code> contains
							the courier provider result. The available fields depend on the
							courier response.
						</p>
					</div>
					<div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm sm:p-8">
						<div className="mb-5 flex items-center gap-3">
							<span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
								<Clipboard className="size-5" />
							</span>
							<div>
								<p className="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-600">
									Error format
								</p>
								<h2 className="text-xl font-extrabold text-slate-900">
									Error response
								</h2>
							</div>
						</div>
						<CodeBlock
							code={errorResponse}
							language="json"
							copied={copiedId === "error"}
							onCopy={() => copyCode("error", errorResponse)}
						/>
					</div>
				</section>

				<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<SectionHeading eyebrow="Reference" title="HTTP errors" />
					<div className="overflow-hidden rounded-2xl border border-slate-200">
						<div className="hidden grid-cols-[100px_1fr_1fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-500 sm:grid">
							<span>Status</span>
							<span>Meaning</span>
							<span>When it happens</span>
						</div>
						{errorRows.map((row) => (
							<div
								key={row.status}
								className="grid gap-1 border-t border-slate-200 px-4 py-3.5 sm:grid-cols-[100px_1fr_1fr] sm:gap-4"
							>
								<span className="font-mono text-sm font-extrabold text-rose-600">
									{row.status}
								</span>
								<span className="text-sm font-bold text-slate-800">
									{row.label}
								</span>
								<span className="text-sm text-slate-500">{row.message}</span>
							</div>
						))}
					</div>
				</section>

				<section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
					<strong>Keep your API key private.</strong> Store it in a server-side
					environment variable. Do not commit it to Git or expose it in browser
					code unless your integration specifically requires that risk.
				</section>
			</div>
		</main>
	);
}
