const zones = {
	1: [
		'Алматы',
		'Караганда',
		'Павлодар',
		'Костанай',
		'Кокшетау',
		'Петропавловск',
	],
	2: [
		'Оскемен',
		'Семей',
		'Екибастуз',
		'Атбасар',
		'Степногорск',
		'Тараз',
		'Шымкент',
		'Туркестан',
		'Кызылорда',
	],
	3: ['Актау', 'Атырау', 'Уральск', 'Актобе', 'Жезказган', 'Талдыкорган'],
	4: ['Аксай', 'Аксу', 'Жанаозен', 'Рудный'],
}

const tariffs = {
	1: { 0.3: 2500, 0.5: 2700, 1: 3200, 1.5: 3500, 2: 3800, extra: 400 },
	2: { 0.3: 2800, 0.5: 3000, 1: 3500, 1.5: 3800, 2: 4100, extra: 500 },
	3: { 0.3: 3100, 0.5: 3400, 1: 3700, 1.5: 4000, 2: 4300, extra: 600 },
	4: { 0.3: 3600, 0.5: 3900, 1: 4200, 1.5: 4500, 2: 4800, extra: 700 },
	5: { 0.3: 5800, 0.5: 6200, 1: 6500, 1.5: 6900, 2: 7200, extra: 700 },
}

function getZone(city) {
	for (const [zone, cities] of Object.entries(zones)) {
		if (cities.includes(city)) return parseInt(zone)
	}
	return 5
}

function getExpressTariff(zone, weight) {
	const t = tariffs[zone]
	if (weight <= 0.3) return t['0.3']
	if (weight <= 0.5) return t['0.5']
	if (weight <= 1) return t['1']
	if (weight <= 1.5) return t['1.5']
	if (weight <= 2) return t['2']
	const extra = Math.ceil((weight - 2) / 0.5)
	return t['2'] + extra * t.extra
}

function getPrimeTariff(zone, weight) {
	const base = {
		0.5: 8000,
		1: 9000,
		1.5: 10500,
		2: 12000,
	}

	const extra = 700

	if (zone !== 1) return getPrimeTariff(1, weight) * 2

	if (weight <= 0.5) return base['0.5']
	if (weight <= 1) return base['1']
	if (weight <= 1.5) return base['1.5']
	if (weight <= 2) return base['2']

	const extraKg = Math.ceil((weight - 2) / 0.5)
	return base['2'] + extraKg * extra
}
function getLocalTariff(
	weight,
	deliveryRange = 'in_city',
	deliveryMethod = 'door_to_door'
) {
	if (deliveryRange === 'in_city') {
		// Внутри города (два вида доставки)
		const inCityDoor = [
			{ max: 1, price: 2000 },
			{ max: 5, price: 3200 },
			{ max: 10, price: 5000 },
			{ max: 20, price: 6000 },
			{ max: 50, price: 10000 },
		]
		const inCityPostamat = [
			{ max: 1, price: 2000 },
			{ max: 5, price: 3200 },
			{ max: 10, price: 5000 },
			{ max: 20, price: 5000 },
			{ max: 50, price: 9000 },
		]

		const tiers =
			deliveryMethod === 'door_to_postamat' ? inCityPostamat : inCityDoor
		let base = 0

		for (let t of tiers) {
			if (weight <= t.max) {
				base = t.price
				break
			}
		}

		if (weight > 50) {
			const extraKg = weight - 50
			const last = tiers[tiers.length - 1].price
			const perKg = deliveryMethod === 'door_to_postamat' ? 250 : 250
			return last + perKg * extraKg
		}

		return base
	} else {
		// До 50 км от Астаны (только дверь-дверь)
		const outCity = [
			{ max: 1, price: 3600 },
			{ max: 5, price: 5000 },
			{ max: 10, price: 6000 },
			{ max: 20, price: 10000 },
			{ max: 50, price: 12000 },
		]

		for (let t of outCity) {
			if (weight <= t.max) return t.price
		}

		// > 50 кг
		const extraKg = weight - 50
		return outCity[outCity.length - 1].price + extraKg * 300
	}
}

module.exports = { getZone, getExpressTariff, getPrimeTariff, getLocalTariff }
