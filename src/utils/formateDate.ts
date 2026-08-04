export const formateDate = (createdAt: string | number | Date) => {
	const date = new Date(createdAt);
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	return date.toLocaleString("en-US", options);
};
