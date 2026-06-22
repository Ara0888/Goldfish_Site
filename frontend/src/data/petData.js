export const petTypes = [
  { id: 'cat', name: 'Кошка/Кот', breeds: ['Беспородная', 'Мейн-кун', 'Британская', 'Шотландская', 'Сиамская', 'Персидская', 'Сфинкс' ] },
  { id: 'dog', name: 'Собака', breeds: [ 'Беспородная', 'Лабрадор', 'Немецкая овчарка', 'Хаски', 'Корги', 'Такса', 'Чихуахуа'] },
  { id: 'bird', name: 'Птица', breeds: ['Волнистый попугай', 'Канарейка', 'Ара', 'Жако', 'Голубь'] },
  { id: 'fish', name: 'Рыба', breeds: ['Скалярия', 'Гуппи', 'Золотая рыбка', 'Дискус', 'Неон'] },
  { id: 'reptile', name: 'Рептилия', breeds: ['Леопардовый геккон', 'Бородатая агама', 'Красноухая черепаха', 'Игуана'] }
];

// Проверка совместимости корма с особенностями питомца
export function checkCompatibility(product, pet) {
  if (!pet || !pet.specialNeeds) return { compatible: true, reason: '' };
  
  const needs = pet.specialNeeds.toLowerCase();
  const name = product.name.toLowerCase();
  
  // Примеры правил совместимости
  if (needs.includes('аллергия на курицу') && name.includes('chicken')) {
    return { compatible: false, reason: 'Содержит курицу' };
  }
  if (needs.includes('диабет') && name.includes('sugar')) {
    return { compatible: false, reason: 'Содержит сахар' };
  }
  if (needs.includes('проблемы с почками') && name.includes('phosphor')) {
    return { compatible: false, reason: 'Высокое содержание фосфора' };
  }
  
  return { compatible: true, reason: '' };
}