export const petTypes = [
  { id: 'Кошки', name: 'Кошки', breeds: ['Беспородная', 'Мейн-кун', 'Британская', 'Шотландская', 'Сиамская', 'Персидская', 'Сфинкс' ] },
  { id: 'Собаки', name: 'Собаки', breeds: [ 'Беспородная', 'Лабрадор', 'Немецкая овчарка', 'Хаски', 'Корги', 'Такса', 'Чихуахуа'] },
  { id: 'Птицы', name: 'Птицы', breeds: ['Волнистый попугай', 'Канарейка', 'Ара', 'Жако', 'Голубь'] },
  { id: 'Рыбы', name: 'Рыбы', breeds: ['Скалярия', 'Гуппи', 'Золотая рыбка', 'Дискус', 'Неон'] },
  { id: 'Рептилии', name: 'Рептилии', breeds: ['Леопардовый геккон', 'Бородатая агама', 'Красноухая черепаха', 'Игуана'] }
];


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