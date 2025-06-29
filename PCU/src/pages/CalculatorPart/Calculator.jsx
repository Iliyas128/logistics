import axios from 'axios'
import React, { useState } from 'react'
import { FaWeight, FaMapMarkerAlt, FaCalculator } from 'react-icons/fa'
import './Calculator.scss'

const cityList = [
	'Алматы',
	'Караганда',
	'Павлодар',
	'Костанай',
	'Кокшетау',
	'Петропавловск',
	'Оскемен',
	'Семей',
	'Екибастуз',
	'Атбасар',
	'Степногорск',
	'Тараз',
	'Шымкент',
	'Туркестан',
	'Кызылорда',
	'Актау',
	'Атырау',
	'Уральск',
	'Актобе',
	'Жезказган',
	'Талдыкорган',
	'Аксай',
	'Аксу',
	'Жанаозен',
	'Рудный',
]

const Calculator = () => {
	const [formData, setFormData] = useState({
		weight: '',
		dimensions: { length: '', width: '', height: '' },
		to: '',
		tariffType: 'EXPRESS',
		deliveryRange: '', // 'in_city' или 'outside_city'
		deliveryMethod: '', // 'door_to_door' или 'door_to_postamat'

		extraServices: {
			insurance: false,
			personalDelivery: false,
			redirection: false,
		},
	})

	const [result, setResult] = useState(null)
	const [error, setError] = useState(null)
	const [citySuggestions, setCitySuggestions] = useState([])
	const [activeField, setActiveField] = useState(null)

	const handleInputChange = e => {
		const { name, value } = e.target

		if (name.includes('dimensions.')) {
			const dimension = name.split('.')[1]
			setFormData(prev => ({
				...prev,
				dimensions: {
					...prev.dimensions,
					[dimension]: Number(value),
				},
			}))
			return
		}

		if (name.startsWith('extraServices.')) {
			const service = name.split('.')[1]
			setFormData(prev => ({
				...prev,
				extraServices: {
					...prev.extraServices,
					[service]: e.target.checked,
				},
			}))
			return
		}

		if (name === 'to') {
			const valueLower = value.toLowerCase()
			const filtered = cityList.filter(city =>
				city.toLowerCase().startsWith(valueLower)
			)
			setCitySuggestions(filtered)
			setActiveField(name)

			setFormData(prev => ({ ...prev, [name]: value }))
			return
		}
		if (name === 'deliveryRange') {
			setFormData(prev => ({
				...prev,
				deliveryRange: value,
				deliveryMethod: '',
			}))
			return
		}

		setFormData(prev => ({
			...prev,
			[name]: name === 'weight' ? Number(value) : value,
		}))
	}

	const handleCitySelect = city => {
		setFormData(prev => ({ ...prev, [activeField]: city }))
		setCitySuggestions([])
	}

	const handleSubmit = async e => {
		e.preventDefault()
		console.log('Sending formData:', formData)
		try {
			const response = await axios.post(
				'http://localhost:5000/api/calc/calculate',
				{ ...formData, from: 'Астана' }
			)
			console.log('Server response:', response.data)
			setResult(response.data)
			setError(null)
		} catch (err) {
			console.error('Calc error:', err.response?.data || err.message)
			setError('Ошибка при расчёте. Проверьте данные.')
			setResult(null)
		}
	}

	return (
		<div className='calculator-page'>
			<div className='calculator-container'>
				<div className='calculator-header'>
					<FaCalculator className='calculator-icon' />
					<h1>Калькулятор стоимости доставки</h1>
					<p>Рассчитайте стоимость доставки вашей посылки</p>
				</div>

				<form onSubmit={handleSubmit} className='calculator-form'>
					<div className='form-group'>
						<label>
							<FaWeight className='input-icon' /> Вес посылки (кг)
						</label>
						<input
							type='number'
							name='weight'
							value={formData.weight}
							onChange={handleInputChange}
							placeholder='Введите вес'
							required
						/>
					</div>

					<div className='dimensions-group'>
						<h3>Габариты посылки (см)</h3>
						<div className='dimensions-inputs'>
							{['length', 'width', 'height'].map(dim => (
								<div className='form-group' key={dim}>
									<label>
										{dim === 'length'
											? 'Длина'
											: dim === 'width'
											? 'Ширина'
											: 'Высота'}
									</label>
									<input
										type='number'
										name={`dimensions.${dim}`}
										value={formData.dimensions[dim]}
										onChange={handleInputChange}
										placeholder={dim}
										required
									/>
								</div>
							))}
						</div>
					</div>

					<div className='locations-group'>
						{formData.tariffType !== 'LOCAL' && (
							<div className='form-group'>
								<label>
									<FaMapMarkerAlt className='input-icon' /> Куда
								</label>
								<input
									type='text'
									name='to'
									value={formData.to}
									onChange={handleInputChange}
									onFocus={() => {
										setCitySuggestions(cityList)
										setActiveField('to')
									}}
									placeholder='Город получения'
									autoComplete='off'
									required
								/>
								{activeField === 'to' && citySuggestions.length > 0 && (
									<ul className='city-suggestions'>
										{citySuggestions.map(city => (
											<li key={city} onClick={() => handleCitySelect(city)}>
												{city}
											</li>
										))}
									</ul>
								)}
							</div>
						)}
					</div>

					<div className='form-group extra-services'>
						<h4>Дополнительные услуги</h4>
						{[
							{ key: 'insurance', label: 'Страховка (+1%)' },
							{ key: 'personalDelivery', label: 'Вручение лично (+50%)' },
							{ key: 'redirection', label: 'Переадресация (+750 тг)' },
						].map(opt => (
							<div key={opt.key}>
								<label>
									<input
										type='checkbox'
										name={`extraServices.${opt.key}`}
										checked={formData.extraServices[opt.key]}
										onChange={handleInputChange}
									/>
									{opt.label}
								</label>
							</div>
						))}
					</div>

					<div className='form-group'>
						<label htmlFor='tariffType'>Тип тарифа</label>
						<select
							name='tariffType'
							value={formData.tariffType}
							onChange={handleInputChange}
							required
						>
							<option value='EXPRESS'>EXPRESS (обычная доставка)</option>
							<option value='PRIME'>PRIME (срочная авиадоставка)</option>
							<option value='LOCAL'>LOCAL (по городу)</option>
						</select>
					</div>
					{formData.tariffType === 'LOCAL' && (
						<div className='form-group'>
							<label>Зона доставки (только для LOCAL)</label>
							<select
								name='deliveryRange'
								value={formData.deliveryRange}
								onChange={handleInputChange}
								required
							>
								<option value=''>Выберите зону</option>
								<option value='in_city'>В пределах города</option>
								<option value='outside_city'>До 50 км от города</option>
							</select>
						</div>
					)}
					{formData.deliveryRange === 'in_city' && (
						<div className='form-group'>
							<label>Способ доставки</label>
							<select
								name='deliveryMethod'
								value={formData.deliveryMethod}
								onChange={handleInputChange}
								required
							>
								<option value=''>Выберите способ</option>
								<option value='door_to_door'>Дверь — Дверь</option>
								<option value='door_to_postamat'>Дверь — Постамат</option>
							</select>
						</div>
					)}
					{formData.deliveryRange === 'outside_city' && (
						<input type='hidden' name='deliveryMethod' value='door_to_door' />
					)}

					<button type='submit' className='calculate-button'>
						Рассчитать стоимость
					</button>
				</form>

				{result && (
					<div className='result-card'>
						<h3>Результаты расчета:</h3>
						<p>
							📦 Стоимость доставки: <strong>{result.price} тг</strong>
						</p>
						<p>⚖ Расчётный вес: {result.chargeableWeight.toFixed(2)} кг</p>
						<p>🗺 Тарифная зона: {result.zone}</p>
					</div>
				)}

				{error && (
					<div className='error-message'>
						<p>{error}</p>
					</div>
				)}

				<div className='calculator-info'>
					<div className='info-card'>
						<h3>Как рассчитывается стоимость?</h3>
						<p>
							Стоимость зависит от веса, габаритов (объёмного веса) и
							расстояния. Объёмный вес = Длина × Ширина × Высота / 5000
						</p>
					</div>
					<div className='info-card'>
						<h3>Дополнительные услуги</h3>
						<p>
							Вы можете выбрать страхование, вручение лично, переадресацию и др.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Calculator
