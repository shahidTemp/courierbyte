export const ROLES = {
	USER: "user",
	ADMIN: "admin",
	SUPER_ADMIN: "super_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

const ROLE_LEVEL: Record<Role, number> = {
	[ROLES.USER]: 0,
	[ROLES.ADMIN]: 1,
	[ROLES.SUPER_ADMIN]: 2,
};

export function isRole(value: unknown): value is Role {
	return typeof value === "string" && Object.hasOwn(ROLE_LEVEL, value);
}

export function hasRequiredRole(
	actualRole: unknown,
	requiredRole: Role,
): boolean {
	return isRole(actualRole) && ROLE_LEVEL[actualRole] >= ROLE_LEVEL[requiredRole];
}
