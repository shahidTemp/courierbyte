const requiredVars = ["PORT", "MONGODB_URI", "JWT_SECRET"];

requiredVars.forEach((key) => {
	if (!process.env[key]) {
		console.error(`❌ Missing required env variable: ${key}`);
		process.exit(1);
	}
});

export const env = {
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: Number(process.env.PORT) || 3000,
	MONGODB_URI: process.env.MONGODB_URI,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
};
