type LogoIconProps = {
	className?: string;
};

export function LogoIcon({ className }: LogoIconProps) {
	return (
		<img
			src="/logo.png"
			alt=""
			aria-hidden="true"
			className={`object-contain ${className ?? ""}`}
		/>
	);
}
