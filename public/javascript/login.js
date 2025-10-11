(() => {
	const form = document.getElementById('loginForm');
	const errorBox = document.getElementById('formError');

	function showError(message, details = []) {
		if (!errorBox) return;
		const extra = Array.isArray(details) && details.length
			? ' ' + details.join(' \u2022 ')
			: '';
		errorBox.textContent = message + extra;
		errorBox.classList.remove('hidden');
	}

	function clearError() {
		if (!errorBox) return;
		errorBox.textContent = '';
		errorBox.classList.add('hidden');
	}

	if (!form) return;
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		clearError();

		const email = document.getElementById('email')?.value.trim();
		const password = document.getElementById('password')?.value;

		if (!email || !password) {
			return showError('Missing required fields', [!email ? 'Email is required' : null, !password ? 'Password is required' : null].filter(Boolean));
		}

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await res.json();
			if (!res.ok) {
				return showError(data?.error || 'Login failed', data?.details || []);
			}

			// Cookie-based session established server-side; go to dashboard
			window.location.href = '/dashboard';
		} catch (err) {
			showError('Network error. Please try again.');
		}
	});
})();

