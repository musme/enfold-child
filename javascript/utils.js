export const validateEmail = (value) =>
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		String(value).toLowerCase()
	);

export const getNoun = (number, one, two, five) => {
	let n = Math.abs(number);
	n %= 100;
	if (n >= 5 && n <= 20) {
		return five;
	}
	n %= 10;
	if (n === 1) {
		return one;
	}
	if (n >= 2 && n <= 4) {
		return two;
	}
	return five;
};

export const validatePassword = (password = '') => {
	let length = password.length >= 8;
	let hasUpper = /[A-Z]/.test(password);
	let hasLower = /[a-z]/.test(password);
	let hasChars =
		/[\~\!\@\#\$\%\^\&\*\(\)\_\+\`\-\=\{\}\[\]\:\;\<\>\\\.\/\\]/.test(
			password
		);
	let hasDigits = /[0-9]/.test(password);
	let pairs = password.match(/(?=(.))\1{2,}/g);
	let noRepeats =
		!!password.length &&
		(!pairs || pairs.length < 2) &&
		!/(?=(.))\1{4,}/g.test(password);

	let score = 0;

	if (length) score = 0;
	if (length && noRepeats) score = 1;
	if (length && noRepeats && hasDigits) score = 2;
	if (length && noRepeats && hasDigits && hasLower && hasUpper) score = 3;
	if (length && noRepeats && hasUpper && hasLower && hasChars && hasDigits)
		score = 4;

	const types = [
		'Очень слабый',
		'Слабый',
		'Средний',
		'Надёжный',
		'Очень надёжный',
	];

	return { score, text: types[score] };
};

export const money = (
	sum = 0,
	currency = 'RUB',
	currencyDisplay = 'symbol',
	maximumFractionDigits = 0
) => {
	let cur = currency;
	if (cur === 'RUR') cur = 'RUB';
	const formatter = new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: cur,
		currencyDisplay,
		maximumFractionDigits,
	});

	return formatter.format(parseFloat(sum));
};

export const formatNumber = (
	sum = 0,
	minimumFractionDigits,
	maximumFractionDigits
) => {
	const formatter = new Intl.NumberFormat('ru-RU', {
		style: 'decimal',
		minimumFractionDigits,
		maximumFractionDigits,
	});

	return formatter.format(parseFloat(sum));
};
