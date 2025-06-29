const {
	getZone,
	getExpressTariff,
	getPrimeTariff,
	getLocalTariff,
} = require('../utils/tariffUtils')

exports.calculatePrice = (req, res) => {
	const {
		weight,
		dimensions,
		from,
		to,
		extraServices = {},
		tariffType = 'EXPRESS',
	} = req.body
	const { length, width, height } = dimensions

	const volumeWeight = (length * width * height) / 5000
	const chargeableWeight = Math.max(weight, volumeWeight)

	let price = 0
	let zone = null

	switch (tariffType) {
		case 'EXPRESS':
			zone = getZone(to)
			price = getExpressTariff(zone, chargeableWeight)
			break

		case 'PRIME':
			zone = getZone(to)
			price = getPrimeTariff(zone, chargeableWeight)
			break

		case 'LOCAL':
			const { deliveryRange, deliveryMethod } = req.body

			if (!deliveryRange) {
				return res.status(400).json({ error: 'Не выбрана зона доставки' })
			}

			price = getLocalTariff(weight, deliveryRange, deliveryMethod)
			break

		default:
			return res.status(400).json({ error: 'Неверный тип тарифа' })
	}

	// Дополнительные услуги
	if (extraServices.insurance) {
		const insured = price * 1.01
		price = Math.max(insured, 5000)
	}

	if (extraServices.personalDelivery) {
		price *= 1.5
	}

	if (extraServices.redirection) {
		price += 750
	}

	return res.json({
		price: Math.round(price),
		chargeableWeight,
		zone,
		tariffType,
		appliedExtras: extraServices,
	})
}
