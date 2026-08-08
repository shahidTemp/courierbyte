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

// VITE_SITE_URL can override the production hostname for staging or a future
// domain. Keep a real absolute fallback so canonical and social URLs are never
// emitted as relative URLs in production builds.
const SITE_URL = (
	import.meta.env.VITE_SITE_URL || "https://courierbyte.appbyte.net"
).replace(/\/+$/, "");
const SITE_NAME = "কুরিয়ারবাইট (CourierByte)";
const SITE_TITLE = "কুরিয়ার ফ্রড চেকার | ফ্রি কুরিয়ার হিস্ট্রি চেক — কুরিয়ারবাইট";
const SITE_DESCRIPTION =
	"বাংলাদেশের ই-কমার্স ব্যবসার জন্য ফ্রি কুরিয়ার ফ্রড চেকার। কাস্টমারের মোবাইল নম্বর দিয়ে ডেলিভারি, রিটার্ন ও সাকসেস রেশিও দেখে COD ঝুঁকি কমান।";
const SOCIAL_IMAGE = `${SITE_URL}/logo.png`;

const NON_INDEXABLE_ROUTE_PATTERN =
	/^\/(admin|panel|subscription|login|api)(\/|$)/;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: ({ match }) => {
		const pathname = match.pathname;
		const isHomePage = pathname === "/";
		const isNonIndexableRoute = NON_INDEXABLE_ROUTE_PATTERN.test(pathname);
		const canonicalUrl = isNonIndexableRoute
			? undefined
			: new URL(pathname || "/", `${SITE_URL}/`).toString();
		const structuredData = {
			"@context": "https://schema.org",
			"@graph": [
				{
					"@type": "Organization",
					"@id": `${SITE_URL}/#organization`,
					name: SITE_NAME,
					alternateName: "CourierByte",
					url: SITE_URL,
					logo: SOCIAL_IMAGE,
					image: SOCIAL_IMAGE,
					description: SITE_DESCRIPTION,
					areaServed: {
						"@type": "Country",
						name: "Bangladesh",
					},
				},
				{
					"@type": "WebSite",
					"@id": `${SITE_URL}/#website`,
					url: SITE_URL,
					name: SITE_NAME,
					description: SITE_DESCRIPTION,
					inLanguage: "bn-BD",
				},
				{
					"@type": "WebApplication",
					"@id": `${SITE_URL}/#application`,
					name: SITE_NAME,
					url: SITE_URL,
					image: SOCIAL_IMAGE,
					description: SITE_DESCRIPTION,
					applicationCategory: "BusinessApplication",
					operatingSystem: "Web",
					inLanguage: "bn-BD",
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
						: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
				},
				{
					name: "googlebot",
					content: isNonIndexableRoute
						? "noindex, nofollow"
						: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
				},
				{ name: "author", content: SITE_NAME },
				{ name: "application-name", content: SITE_NAME },
				{ name: "theme-color", content: "#0f6b4d" },
				{ name: "referrer", content: "origin-when-cross-origin" },
				{ property: "og:locale", content: "bn_BD" },
				{ property: "og:type", content: "website" },
				{ property: "og:site_name", content: SITE_NAME },
				{ property: "og:title", content: SITE_TITLE },
				{ property: "og:description", content: SITE_DESCRIPTION },
				{ property: "og:image", content: SOCIAL_IMAGE },
				{ property: "og:image:secure_url", content: SOCIAL_IMAGE },
				{ property: "og:image:type", content: "image/png" },
				{ property: "og:image:width", content: "1254" },
				{ property: "og:image:height", content: "1254" },
				{
					property: "og:image:alt",
					content: "কুরিয়ারবাইট — কুরিয়ার ফ্রড চেকার",
				},
				...(canonicalUrl
					? [{ property: "og:url" as const, content: canonicalUrl }]
					: []),
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: SITE_TITLE },
				{ name: "twitter:description", content: SITE_DESCRIPTION },
				{ name: "twitter:image", content: SOCIAL_IMAGE },
				{
					name: "twitter:image:alt",
					content: "কুরিয়ারবাইট — কুরিয়ার ফ্রড চেকার",
				},
			],
			links: [
				{ rel: "stylesheet", href: appCss },
				{ rel: "icon", type: "image/png", href: "/logo.png" },
				{ rel: "manifest", href: "/manifest.json" },
				...(canonicalUrl
					? [{ rel: "canonical" as const, href: canonicalUrl }]
					: []),
			],
			scripts: isHomePage
				? [
						{
							type: "application/ld+json",
							children: JSON.stringify(structuredData),
						},
					]
				: [],
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
