import { flattenAttributes, getStrapiURL } from "@/lib/utils";
import qs from "qs";

const baseUrl = getStrapiURL();

async function fetchData(url: string) {
	const authToken = null; // we will implement this later getAuthToken() later
	const headers = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${authToken}`,
		},
	};

	try {
		const response = await fetch(url, authToken ? headers : {});
		const data = await response.json();
		return flattenAttributes(data);
	} catch (error) {
		console.error("Error fetching data:", error);
		throw error; // or return null;
	}
}

export const getHomePageData = async () => {
	const url = new URL("/api/home-page", baseUrl);
	url.search = qs.stringify({
		populate: {
			blocks: {
				populate: {
					image: {
						fields: ["url", "alternativeText"],
					},
					link: {
						populate: true,
					},
					feature: {
						populate: true,
					},
				},
			},
		},
	});

	return await fetchData(url.href);
};

export const getGlobalPageData = async () => {
	const url = new URL("/api/global", baseUrl);
	url.search = qs.stringify({
		populate: ["header.logoText", "header.ctaButton", "footer.logoText", "footer.socialLink"],
	});

	return await fetchData(url.href);
};

export const getGlobalPageMetadata = async () => {
	const url = new URL("/api/global", baseUrl);
	url.search = qs.stringify({
		fields: ["title", "description"],
	});

	return await fetchData(url.href);
};
