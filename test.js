let concordantsFields = [
    model.playerModel.getModelWithId('entity_concordants_1'),
    model.playerModel.getModelWithId('entity_concordants_2'),
    model.playerModel.getModelWithId('entity_concordants_3'),
    model.playerModel.getModelWithId('entity_concordants_4'),
    model.playerModel.getModelWithId('entity_concordants_5'),
    model.playerModel.getModelWithId('entity_concordants_6'),
    model.playerModel.getModelWithId('entity_concordants_7'),
    model.playerModel.getModelWithId('entity_concordants_8')
];

let targetField = model.playerModel.getModelWithId('entity_concordants11_copy1');

// Объединяет массивы и удаляет дубликаты по user.id
const mergeAndDeduplicate = (lists) => {
    const seen = new Set();
    const result = [];

    lists.flat().forEach(user => {
        if (user?.id && !seen.has(user.id)) {
            seen.add(user.id);
            result.push(user);
        }
    });

    return result;
};

const transferDynamicValues = () => {   
    let allUsers = [];

    concordantsFields.forEach((field, index) => {
        const value = field.getValue();
        if (Array.isArray(value) && value.length > 0) {
            if (index === 0) {
                allUsers.push(value[0]); // только первый из первого поля
            } else {
                allUsers = allUsers.concat(value); // все из остальных
            }
        }
    });

    const uniqueUsers = mergeAndDeduplicate([allUsers]);

    targetField.setValue(uniqueUsers);
};

// Навешиваем слежение на все поля
concordantsFields.forEach(field => {
    field.on('valueChange', transferDynamicValues);
});

// Также обновляем при загрузке формы
model.on('valueChange', transferDynamicValues);