import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { UserProvider } from "@/context/userContext";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

// Configure VITE_SITE_URL in production (for example, https://example.com) so
// canonical and social URLs are absolute without hard-coding an unverified domain.
const SITE_URL = import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "");
const SITE_NAME = "কুরিয়ারবাইট (CourierByte)";
const SITE_TITLE = "কুরিয়ারবাইট | বাংলাদেশে রিয়েল-টাইম কুরিয়ার হিস্ট্রি চেক";
const SITE_DESCRIPTION =
	"বাংলাদেশের ই-কমার্স ব্যবসার জন্য রিয়েল-টাইম কুরিয়ার হিস্ট্রি চেক। কাস্টমারের মোবাইল নম্বর দিয়ে ডেলিভারি, রিটার্ন ও সাকসেস রেশিও দেখে COD ঝুঁকি কমান।";

// These describe real topics covered by the public homepage. Google ignores the
// old meta-keywords tag, so keep them in meaningful structured data instead.
const SEARCH_TOPICS = [
	"courier check Bangladesh",
	"customer courier history check",
	"COD risk checker Bangladesh",
	"parcel delivery history",
	"কুরিয়ার হিস্ট্রি চেক",
	"কাস্টমার নাম্বার চেক",
	"ডেলিভারি হিস্ট্রি যাচাই",
	"ক্যাশ অন ডেলিভারি ঝুঁকি কমানো",
	"ই-কমার্স অর্ডার যাচাই",
	"রিটার্ন কমানোর টুল",
];

const NON_INDEXABLE_ROUTE_PATTERN =
	/^\/(admin|panel|subscription|login|api)(\/|$)/;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: ({ match }) => {
		const pathname = match.pathname;
		const isNonIndexableRoute = NON_INDEXABLE_ROUTE_PATTERN.test(pathname);
		const canonicalUrl = SITE_URL
			? `${SITE_URL}${pathname === "/" ? "/" : pathname}`
			: undefined;
		const structuredData = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "Organization",
					"@id": canonicalUrl ? `${SITE_URL}/#organization` : undefined,
					name: SITE_NAME,
					alternateName: "CourierByte",
					description: SITE_DESCRIPTION,
					areaServed: {
						"@type": "Country",
						name: "Bangladesh",
					},
					knowsAbout: SEARCH_TOPICS,
					...(canonicalUrl ? { url: SITE_URL } : {}),
				},
				{
					"@type": "WebSite",
					"@id": canonicalUrl ? `${SITE_URL}/#website` : undefined,
					name: SITE_NAME,
					description: SITE_DESCRIPTION,
					inLanguage: "bn-BD",
					...(canonicalUrl ? { url: SITE_URL } : {}),
				},
			],
		};

		return {
			meta: [
				{ charSet: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					title: isNonIndexableRoute ? `${SITE_NAME} | Dashboard` : SITE_TITLE,
				},
				{
					name: "description",
					content: SITE_DESCRIPTION,
				},
				{
					name: "robots",
					content: isNonIndexableRoute
						? "noindex, nofollow"
						: "index, follow, max-image-preview:large",
				},
				{
					name: "googlebot",
					content: isNonIndexableRoute
						? "noindex, nofollow"
						: "index, follow, max-image-preview:large",
				},
				{ name: "author", content: SITE_NAME },
				{ name: "application-name", content: SITE_NAME },
				{ name: "theme-color", content: "#0f6b4d" },
				{ property: "og:locale", content: "bn_BD" },
				{ property: "og:type", content: "website" },
				{ property: "og:site_name", content: SITE_NAME },
				{ property: "og:title", content: SITE_TITLE },
				{ property: "og:description", content: SITE_DESCRIPTION },
				...(canonicalUrl
					? [{ property: "og:url" as const, content: canonicalUrl }]
					: []),
				{ name: "twitter:card", content: "summary" },
				{ name: "twitter:title", content: SITE_TITLE },
				{ name: "twitter:description", content: SITE_DESCRIPTION },
			],
			links: [
				{ rel: "stylesheet", href: appCss },
				{ rel: "icon", type: "image/png", href: "/logo.png" },
				...(canonicalUrl
					? [{ rel: "canonical" as const, href: canonicalUrl }]
					: []),
			],
			scripts: isNonIndexableRoute
				? []
				: [
						{
							type: "application/ld+json",
							children: JSON.stringify(structuredData),
						},
					],
		};
	},
	component: RootComponent,
	shellComponent: RootDocument,
});

function RootComponent() {
	const { queryClient } = Route.useRouteContext();

	return (
		<QueryClientProvider client={queryClient}>
			<UserProvider>
				<Outlet />
			</UserProvider>
		</QueryClientProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="bn">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
