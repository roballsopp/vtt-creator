export default function usePasswordValidation(password) {
	if (!password) return { isValid: false };

	const hasLowercase = Boolean(password.match(/[a-z]+/));
	const hasUppercase = Boolean(password.match(/[A-Z]+/));
	const hasNumber = Boolean(password.match(/\d+/));
	const hasMinLength = password.length > 7;

	return {
		hasLowercase,
		hasUppercase,
		hasNumber,
		hasMinLength,
		isValid: hasLowercase && hasUppercase && hasNumber && hasMinLength,
	};
}
