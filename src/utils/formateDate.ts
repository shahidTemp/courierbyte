// @ts-nocheck
export const formateDate = (createdAt) => {
	const date = new Date(createdAt);
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	return date.toLocaleString("en-US", options);
};
