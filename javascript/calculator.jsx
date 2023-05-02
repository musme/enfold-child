import { createRoot, useState, useEffect } from '@wordpress/element';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { money } from './utils';
import qs from 'qs';

const Calc = ({ data, url }) => {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState();
	const [loading, setLoading] = useState(false);
	const { handleSubmit, register, control } = useForm({
		defaultValues: {
			name: '',
			phone: '',
			email: '',
			text: '',
			robots: data.map((r, index) => {
				return {
					...r,
					count: '0',
					hours: '2',
					days: '0',
				};
			}),
		},
	});

	const { fields } = useFieldArray({
		name: 'robots',
		control,
	});

	useEffect(() => {
		if (success) {
			setTimeout(() => {
				window.location.reload();
			}, 3000);
		}
	}, [success]);

	const onSubmit = async (values) => {
		setSuccess(false);
		setError('');
		setLoading(true);
		const { robots } = values;
		const { totalRentPrice, totalSalePrice } = getTotalPrices(robots);
		const robotsWithPrices = [...robots].map((data) => {
			const rentPrice = getRentPrice(data);
			const salePrice = getSalePrice(data);
			return {
				...data,
				rentPrice: money(rentPrice),
				salePrice: money(salePrice),
			};
		});

		const data = {
			...values,
			robots: robotsWithPrices,
			totalRentPrice: money(totalRentPrice),
			totalSalePrice: money(totalSalePrice),
		};

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: qs.stringify({ data: JSON.stringify(data) }),
			});

			const { success } = await response.json();
			if (success) {
				setSuccess(true);
				if (window.ym !== undefined) {
					window.ym(24343222, 'reachGoal', 'raschet-cen');
				}
			} else {
				throw new Error('Что-то пошло не так');
			}
		} catch (error) {
			setError(error.message);
		}
		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} id={'calc_form'}>
			{fields.map((robot, index) => {
				return (
					<div className="form-item" key={robot.id}>
						<div className="form-robots__name">
							<h2>{robot.title}</h2>
						</div>
						<div className="form-robots__description">
							<div className="form-robots__img-link">
								<img
									src={robot.image}
									alt={robot.title}
									className="w-full"
								/>
								<a href={robot.link}>Подробнее</a>
							</div>
							<div className="form-robots__count">
								<span>Количество</span>
								<input
									{...register(`robots.${index}.count`)}
									type="number"
									min="0"
								></input>
							</div>
							<div className="form-robots__hours">
								<span>Часов/день</span>
								<select {...register(`robots.${index}.hours`)}>
									<option value="2">До 2-x часов</option>
									<option value="4">До 4-x часов</option>
									<option value="8">До 8-ми часов</option>
								</select>
							</div>
							<div className="form-robots__days">
								<span>Дней</span>
								<input
									type="number"
									min="0"
									{...register(`robots.${index}.days`)}
								/>
							</div>
							<RobotPrices
								control={control}
								name={`robots.${index}`}
							/>
						</div>
					</div>
				);
			})}
			<TotalPrices control={control} />
			{success && <div>ВАШ ЗАПРОС ОТПРАВЛЕН</div>}
			{!!error && <div>{error}</div>}
			{!success && (
				<div
					className="form-robots__main-form"
					style={{ border: '1px solid #aaa', padding: 10 }}
				>
					<div className="form-robots__main-form-top">
						<div className="form-robots__main-form-top-name">
							<label htmlFor="name">Имя:</label>
							<input
								{...register('name', { required: true })}
								type="text"
								id="name"
								placeholder="Имя*"
							/>
						</div>
						<div className="form-robots__main-form-top-phone">
							<label htmlFor="phone">Телефон:</label>
							<input
								{...register('phone', { required: true })}
								type="text"
								id="phone"
								placeholder="Телефон*"
							/>
						</div>
						<div className="form-robots__main-form-top-email">
							<label htmlFor="email">*Email:</label>
							<input
								{...register('email', { required: true })}
								type="email"
								id="email"
								placeholder="Емейл*"
							/>
						</div>
					</div>
					<div className="form-robots__main-form-middle">
						<label>Комментарий</label>
						<textarea
							{...register('text')}
							id="textmsg"
							rows="7"
							placeholder="Комментарий"
						></textarea>
					</div>
					<div className="form-robots__main-form-bottom">
						<button type="submit" disabled={loading}>
							{loading ? 'Подождите...' : 'Отправить запрос'}
						</button>
					</div>
				</div>
			)}
		</form>
	);
};

const renderCalc = () => {
	const calc = document.getElementById('robot-calc-react');
	if (!!calc && calc.dataset.cfs && calc.dataset.url) {
		try {
			const root = createRoot(calc);
			root.render(
				<Calc
					data={JSON.parse(calc.dataset.cfs)}
					url={calc.dataset.url}
				/>
			);
		} catch (error) {
			console.error(error);
		}
	}
};

const RobotPrices = ({ control, name }) => {
	const data = useWatch({ control, name });
	const rentPrice = getRentPrice(data);
	const salePrice = getSalePrice(data);
	return (
		<div className="form-robots__price">
			<p className="rent-price">
				Аренда: от <span>{money(rentPrice)}</span>
			</p>
			<p className="buy-price">
				Покупка: от <span>{money(salePrice)}</span>
			</p>
		</div>
	);
};

const TotalPrices = ({ control }) => {
	const { robots } = useWatch({ control });

	const { totalRentPrice, totalSalePrice } = getTotalPrices(robots);

	return (
		<>
			<p className="all">Итоги:</p>
			<div className="form-robots__rent-buy">
				<div className="form-robots__rent">
					<p className="rent-usn">
						Аренда: от <span>{money(totalRentPrice)}</span>
					</p>
				</div>
				<div className="form-robots__buy">
					<p className="buy-usn">
						Покупка: от <span>{money(totalSalePrice)}</span>
					</p>
				</div>
			</div>
		</>
	);
};

const getTotalPrices = (robots) => {
	return robots.reduce(
		(acc, data) => {
			const rentPrice = getRentPrice(data);
			const salePrice = getSalePrice(data);
			acc.totalRentPrice += rentPrice;
			acc.totalSalePrice += salePrice;
			return acc;
		},
		{ totalRentPrice: 0, totalSalePrice: 0 }
	);
};

const getSalePrice = (data) => {
	let { price, count, sconto_by_items_sale } = data;
	const countInt = parseInt(count) || 0;
	const priceInt = parseInt(price) || 0;
	const basePrice = priceInt * countInt;
	const scontoByItemsRange = getRange(sconto_by_items_sale, countInt);
	price = basePrice - (basePrice * scontoByItemsRange) / 100;

	return price;
};

const getRentPrice = (data) => {
	const { count, hours, days, sconto_by_days_rent, sconto_by_items_rent } =
		data;
	const countInt = parseInt(count) || 0;
	const daysInt = parseInt(days) || 0;
	const basePrice = data[`rent_${hours}`] ?? 0;
	let price = 0;

	if (daysInt > 0 && countInt > 0) {
		price = basePrice * countInt * daysInt;
		const scontoByDaysRange = getRange(sconto_by_days_rent, daysInt);
		const scontoByItemsRange = getRange(sconto_by_items_rent, countInt);
		const totalSconto = scontoByDaysRange + scontoByItemsRange;
		price = price - (price * totalSconto) / 100;
	}

	return price;
};

const getRange = (arrayOfRanges = [], num) => {
	const rangeIndex = arrayOfRanges.findIndex((rangeData) => {
		const range = rangeData?.range ?? '';
		let [from, to] = range.trim().split('-');
		if (!from || !to) return false;
		from = parseInt(from);
		to = parseInt(to);
		if (num >= from && num < to) return true;
		return false;
	});

	if (rangeIndex === -1) return 0;

	return parseInt(arrayOfRanges[rangeIndex].sconto ?? 0) ?? 0;
};

export default renderCalc;
