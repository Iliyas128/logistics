import { serviceLabels } from './serviceLabels';

export async function generateOrderPDF(order) {
  const jsPDF = (await import('jspdf')).default;
  await import('../../shared/fonts/FreeSans-normal.js');
  console.log('extraServices:', order.extraServices);

  // Формат A4, портрет
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFont('FreeSans', 'normal');
  doc.setFontSize(10);

  const today = new Date().toLocaleDateString('ru-RU');

  function drawInvoice(doc, order, offsetY = 0, label = '') {
    if (label) {
      doc.setFontSize(10);
      doc.text(label, 10, 8 + offsetY);
    }
    doc.setFontSize(20);
    doc.text('SHM EXPRESS', 10, 12 + offsetY);
    doc.setFontSize(12);
    doc.rect(90, 5 + offsetY, 60, 10);
    doc.text('Call-center 8(700)799-78-59', 92, 12 + offsetY);
    doc.rect(155, 5 + offsetY, 35, 10);
    doc.text(order?.orderNumber?.toString().padStart(6, "0") || '', 172.5, 12 + offsetY, { align: 'center' });

    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(10);
    doc.text('Жөнелтуші / Отправитель', 10, 20 + offsetY);
    doc.setFont('FreeSans', 'normal');
    doc.rect(10, 22 + offsetY, 90, 35);
    const senderFields = [
      ['Компания / Компания БИН', order.senderCompany],
      ['Байланысатын тұлғаның аты-жөні / Ф.И.О контактного лица ИИН', order.senderContact],
      ['Ел / Страна  Қаласы / Город  Индекс / Индекс', `${order.senderCountry || ''} / ${order.senderCity || ''} / ${order.senderZip || ''}`],
      ['Көшесі, Үй, Пәтері / Улица, Дом, Квартира', order.senderAddress],
      ['Телефон', order.senderPhone],
    ];
    let y = 26 + offsetY;
    senderFields.forEach(([label, value]) => {
      doc.setFontSize(6.5);
      doc.text(label, 12, y);
      doc.setFontSize(8);
      doc.text(String(value || ''), 12, y + 3);
      y += 6;
    });

    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(10);
    doc.text('Алушы / Получатель', 10, 60 + offsetY);
    doc.setFont('FreeSans', 'normal');
    doc.rect(10, 62 + offsetY, 90, 35);
    const receiverFields = [
      ['Компания / Компания БИН', order.receiverCompany],
      ['Байланысатын тұлғаның аты-жөні / Ф.И.О контактного лица ИИН', order.receiverContact],
      ['Ел / Страна  Қаласы / Город  Индекс / Индекс', `${order.receiverCountry || ''} / ${order.receiverCity || ''} / ${order.receiverZip || ''}`],
      ['Көшесі, Үй, Пәтері / Улица, Дом, Квартира', order.receiverAddress],
      ['Телефон', order.receiverPhone],
    ];
    y = 66 + offsetY;
    receiverFields.forEach(([label, value]) => {
      doc.setFontSize(6.5);
      doc.text(label, 12, y);
      doc.setFontSize(8);
      doc.text(String(value || ''), 12, y + 3);
      y += 6;
    });

    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(8);
    doc.text('Қызмет / Услуги', 105, 20 + offsetY);
    doc.setFont('FreeSans', 'normal');
    doc.rect(105, 22 + offsetY, 95, 40);
    const serviceCheckboxes = [
      { key: 'express', label: 'Экспресс Жедел / Срочно', x: 107, y: 26 + offsetY },
      { key: 'other', label: 'Басқа / Другое', x: 152, y: 26 + offsetY },
      { key: 'city', label: 'Қала / Город', x: 152, y: 30 + offsetY },
      { key: 'deliveryNotice', label: 'Хабарлама / Уведомление', x: 107, y: 34 + offsetY },
    ];
    serviceCheckboxes.forEach(({ key, label, x, y }) => {
      doc.rect(x, y - 2, 3, 3);
      doc.setFontSize(7);
      doc.text(label, x + 5, y);
      if (order.mainServices && Array.isArray(order.mainServices) && order.mainServices.includes(key)) {
        doc.setLineWidth(0.7);
        doc.line(x + 0.5, y - 0.5, x + 1.5, y + 1.5);
        doc.line(x + 1.5, y + 1.5, x + 2.5, y - 1.5);
        doc.setLineWidth(0.2);
      }
    });

    doc.setFontSize(7);
    doc.text('Төлем шарттары / Условия оплаты', 107, 39 + offsetY);
    const paymentConditions = ['Жөнелтуші / Отправитель', 'АлушыПолучатель', '3-ші тарап / 3-я сторона'];
    const paymentFormMap = {
      cash: 0,
      invoice: 1,
    };
    const paymentForms = ['Қолма-қол ақша / Наличные', 'Шот бойынша / По счету'];
    const paymentConditionMap = {
      sender: 0,
      receiver: 1,
      thirdParty: 2,
    };
    paymentConditions.forEach((cond, i) => {
      const yOffset = 44 + i * 4 + offsetY;
      doc.rect(107, yOffset - 4, 3, 3);
      doc.text(cond, 112, yOffset-2);
      if (paymentConditionMap[order.paymentCondition] === i) {
        doc.setLineWidth(0.7);
        doc.line(107.5, yOffset - 3.5, 108.5, yOffset - 1.5);
        doc.line(108.5, yOffset - 1.5, 109.5, yOffset - 3.5);
        doc.setLineWidth(0.2);
      }
    });

    doc.text('Төлем нысаны / Форма оплаты', 155, 39 + offsetY);
    paymentForms.forEach((form, i) => {
      const yOffset = 44 + i * 4 + offsetY;
      doc.rect(155, yOffset - 4, 3, 3);
      doc.text(form, 160, yOffset-2);
      if (paymentFormMap[order.paymentForm] === i) {
        doc.setLineWidth(0.7);
        doc.line(155.5, yOffset - 3.5, 156.5, yOffset - 1.5);
        doc.line(156.5, yOffset - 1.5, 157.5, yOffset - 3.5);
        doc.setLineWidth(0.2);
      }
    });

    doc.setFontSize(7);
    doc.text(`Жүктің суреттемесі–описание груза: ${order.cargoDescription}`, 107, 54 + offsetY);

    doc.setFont('FreeSans', 'normal');
    doc.text('Қосымша ақпарат / Дополнительная информация', 105, 65 + offsetY);
    doc.setFont('FreeSans', 'normal');
    doc.rect(105, 67 + offsetY, 95, 30);

    const extraServicesList = order.extraServices
      ? Object.entries(order.extraServices)
          .filter(([k, v]) => (typeof v === 'object' ? v.selected : v))
          .map(([k, v]) => (serviceLabels?.[k] || k) + (v.price ? ` (+${v.price} тг)` : ''))
          .join(', ')
      : '';

    const declaredValue =
      order.declaredValue && !isNaN(order.declaredValue)
        ? Number(order.declaredValue).toLocaleString('ru-RU')
        : (order.declaredValue || '');

    const info = [
      ['Орындар / Места', order.places],
      ['Нақты Салмағы / Фактический Вес', order.weight],
      ['Көлемдік Салмағы / Объёмный Вес', order.volumeWeight],
      ['Мөлшері / Габариты', order.dimensions && (order.dimensions.length || order.dimensions.width || order.dimensions.height)
        ? `${order.dimensions.length || ''} x ${order.dimensions.width || ''} x ${order.dimensions.height || ''} см`
        : ''],
      ['Қосымша Қызмет / Доп-Услуги', extraServicesList],
      ['Жарияланған құны / Объявлен стоимость', declaredValue],
      ['Шалғай мекен / Отдаленный пункт', order.deliveryPoint],
    ];
    y = 71 + offsetY;
    info.forEach(([label, value]) => {
      doc.setFontSize(6.5);
      doc.text(label, 107, y);
      if (label.includes('Доп-Услуги')) {
        doc.setFontSize(5);
        const lines = doc.splitTextToSize(String(value || ''), 50);
        doc.text(lines, 150, y);
        y += 1.5 * lines.length;
        doc.setFontSize(8);
      } else if (label.includes('Объявлен стоимость')) {
        doc.setFontSize(8);
        doc.text(String(value || ''), 160, y);
      } else {
        doc.setFontSize(8);
        doc.text(String(value || ''), 150, y);
      }
      y += 3.5;
    });

    doc.setFontSize(6.5);
    const agreement = 'Өз қолтаңбамен курьерлік компаниясының жүк тасымалдау шарттарымен келісемін және өзім берген алушы жөнелтiлiм туралы ақпарат үшін жауапкершілікті көтеремін, сондай-ақ осы жөнелтiлiмнiң құрамында қолма-қол ақша, оның эквиваленті мен жіберуге тыйым салынған заттардың жоқтығын растаймын. Егер қабылдаған алушы тасымал үшін төлем ақшадан бас тартса, оның құны жөнелтушiмен төленеді.\nСвоей подписью я соглашаюсь с условиями курьерской компании и несу ответственность за предоставленную мною информацию о получателе и об отправителе, а также подтверждаю, что настоящее отправление не содержит наличных денег, их эквивалент и предметов запрещённых к пересылке. В случае отказа получателем от оплаты перевозки, ее стоимость оплачивается отправителем.';
    doc.text(doc.splitTextToSize(agreement, 190), 10, 100 + offsetY);

    doc.setFontSize(7);
    doc.text('Жіберілген күні / дата отправления', 10, 120 + offsetY);
    doc.text(today, 70, 120 + offsetY);
    doc.text('қолтаңба / подпись', 150, 120 + offsetY);

    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(9);
    doc.text('Жеткізу мәліметтері / Детали доставки', 10, 126 + offsetY);
    doc.setFont('FreeSans', 'normal');
    doc.setFontSize(7);
    doc.rect(10, 128 + offsetY, 190, 19);
    doc.text('Жеткызу туралы акпарат / Информация о доставке', 12, 132 + offsetY);
    doc.text('Қабылдаушының аты-жөні / Ф.И.О Получателя', 12, 140 + offsetY);
    doc.text(`Барлығы / Итого: ${order.price}`, 80, 132 + offsetY);
    doc.text('Қолтаңба / Подпись', 120, 132 + offsetY);
    doc.text('уақыты / время', 150, 132 + offsetY);
    doc.text('күні / дата', 180, 132 + offsetY);

    doc.setFontSize(6);
    doc.text('Мен жөнелтiлiмнiң қаптамасы зақым келтiрiлмей жеткізiлгенін растаймын.', 100, 143 + offsetY);
    doc.text('Я подтверждаю, что отправление доставлено без повреждения упаковки.', 100, 146 + offsetY);
    doc.text('қолтаңба / подпись', 180, 146 + offsetY);
  }

  // Первый экземпляр (верхняя часть)
  drawInvoice(doc, order, 0);
  // Разделительная линия по центру A4
  doc.setLineWidth(0.5);
  doc.line(5, 148, 205, 148);
  // Второй экземпляр (нижняя часть)
  drawInvoice(doc, order, 150);

  doc.save(`order_${order.orderNumber}_nakladnaya.pdf`);
}
