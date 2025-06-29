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
	const isHeavy = weight > 70 && length > 80 && width > 50 && height > 50
	const bubbleArea = (length / 100) * (width / 100) * 6 // м² (грубо: 6 сторон)
	const volume = (length / 100) * (width / 100) * (height / 100) // м³

	const volumeWeight = (length * width * height) / 5000
	const chargeableWeight = Math.max(weight, volumeWeight)

	let price = 0
	let zone = null
	const notes = []

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
	if (extraServices.bubbleWrap) {
		price += Math.ceil(bubbleArea) * 600
		notes.push('Добавлена пузырчатая пленка')
	}
	if (extraServices.stretchWrap) {
		price += Math.ceil(bubbleArea) * 250
		notes.push('Добавлена стрейч пленка')
	}
	if (extraServices.plywoodBox) {
		price += 30000
		notes.push('Добавлен фанерный ящик')
	}
	if (extraServices.woodenFrame) {
		price += Math.ceil(volume) * 18000
		notes.push('Добавлена деревянная обрешетка')
	}

	// Дополнительные услуги
	if (extraServices.insurance) {
		const insuredPrice = price * 1.01
		if (insuredPrice < 5000) {
			notes.push('Страховка не применена: сумма меньше 5000 тг')
		} else {
			price = insuredPrice
			notes.push('Применена страховка (+1%)')
		}
	}

	if (isHeavy) {
		price *= 1.5
		notes.push('Применён коэффициент за тяжеловесный груз (1.5x)')
	}

	if (extraServices.personalDelivery) {
		price *= 1.5
	}

	if (extraServices.redirection) {
		price += 750
	}
	if (extraServices.fragile) {
		price *= 1.5
	}
	if (extraServices.industrialArea) {
		price *= 1.5
	}
	if (extraServices.addressChange) {
		price += 750
		notes.push('Перенаправление адреса (РК): 750 тг')
	}
	if (extraServices.extraDeliveryAttempt) {
		price += 750
		notes.push('Доп. попытка доставки: 750 тг')
	}
	if (extraServices.deliveryNoticeOriginal) {
		price += 600
		notes.push('Уведомление (оригинал): 600 тг')
	}
	if (extraServices.deliveryNoticeScan) {
		price += 200
		notes.push('Уведомление (скан): 200 тг')
	}
	if (extraServices.courierWaitTruck) {
		price += 5500
		notes.push('Простой грузового транспорта: 5500 тг')
	}
	if (extraServices.courierWaitCar) {
		price += 2000
		notes.push('Простой легкового транспорта: 2000 тг')
	}

	if (extraServices?.specialPackaging) {
		if (weight <= 5) {
			price += 1200
			notes.push('Добавлена специализированная упаковка (до 5 кг)')
		} else if (weight <= 10) {
			price += 1800
			notes.push('Добавлена специализированная упаковка (5-10 кг)')
		} else {
			const extraKg = Math.ceil(weight - 10)
			const packagingCost = 1800 + extraKg * 450
			price += packagingCost
			notes.push(
				`Добавлена специализированная упаковка (${weight} кг): ${packagingCost} тг`
			)
		}
	}

	return res.json({
		price: Math.round(price),
		chargeableWeight,
		zone,
		tariffType,
		appliedExtras: extraServices,
		notes,
	})
}
