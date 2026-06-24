export const catalogData = {
  cats: {
    brands: ["Farmina N&D", "Acana", "Orijen", "Grandorf", "Royal Canin Veterinary", "Monge Superpremium", "Brit Care", "Almo Nature Legend", "Applaws", "Now Fresh"],
    bases: ["Quinoa Skin & Coat Neutered", "Regionals Grasslands", "Cat & Kitten", "White Fish & Brown Rice Adult", "Gastrointestinal Kitten", "Sterilised Duck", "Lilly I've Kitten", "Adult Salmon & Rice", "Adult Chicken with Duck", "Indoor Weight Management"],
    types: ["сухой корм холистик", "влажный корм паучи", "консервы мусс", "диетический корм", "лакомства без зерна", "добавка с пробиотиками", "паштет премиум", "корм для длинношёрстных", "рацион для пожилых кошек 7+", "натуральный снек"],
    variations: ["400 г", "1.5 кг", "2 кг", "5.4 кг", "10 кг", "12 кг", "набор 12×85 г", "набор 6×400 г", "эконом-упаковка 15 кг", "пробник 100 г"]
  },
  dogs: {
    brands: ["Acana", "Orijen", "Farmina N&D", "Grandorf", "Royal Canin Veterinary", "Brit Care", "Go! Solutions", "Canagan", "Taste of the Wild", "Monge Speciality"],
    bases: ["Heritage Adult Large Breed", "Original Dog", "Ancestral Grain Chicken", "Lamb & Brown Rice Adult", "Satiety Support", "Adult Large Breed Lamb", "Carnivore Grain Free", "Country Game Dog", "High Prairie Adult", "Sensitive Salmon & Tuna"],
    types: ["сухой корм холистик", "влажный корм в соусе", "консервы с овощами", "диетический рацион", "лакомства для чистки зубов", "добавка с хондропротекторами", "паштет для щенков", "беззерновой корм", "рацион для активных собак", "натуральное вяленое мясо"],
    variations: ["400 г", "2 кг", "6 кг", "11.4 кг", "12 кг", "12.2 кг", "набор 12×400 г", "набор 6×800 г", "эконом-упаковка 18 кг", "пробник 250 г"]
  },
  fish: {
    brands: ["JBL", "Sera", "Tetra", "ADA", "Eheim", "Fluval", "Oase", "Dennerle", "Red Sea", "Aqua Medic"],
    bases: ["ProScan Test Set", "Aqua Bio-Clear 500", "WaferMix Premium", "Aqua Soil Amazonia Ver.2", "classic 2213", "FX6 Canister", "BioMaster 350", "Nano Cube Complete+", "REEFER 170", "T-Rex S 2000"],
    types: ["комплексный тест воды", "профессиональный фильтр", "премиальный корм для донных рыб", "профессиональный питательный грунт", "внешний канистровый фильтр", "высокопроизводительный фильтр", "фильтр с терморегулятором", "нано-аквариум под ключ", "морская аквариумная система", "циркуляционная помпа"],
    variations: ["стандарт", "набор 100 тестов", "500 л/ч", "9 л", "350 л/ч", "комплект с лампой", "250 мл", "500 мл", "1000 мл", "профессиональная серия"]
  },
  birds: {
    brands: ["Versele-Laga Prestige", "Quiko", "Harrison's", "Roudybush", "Cunipic", "NutriBird", "Padovan", "Manu", "Benelux", "Versele-Laga Oropharma"],
    bases: ["Parakeets", "Premium Wellensitt", "Adult Lifetime Fine", "Daily Maintenance Mini", "Nature Pigeons", "G14 Original Parrot", "Pappagalli Grandmix", "Premium Canary", "Premium Exotic", "Omni-Vit"],
    types: ["корм для волнистых попугаев", "корм для средних попугаев", "органический рацион", "гранулированный корм", "корм для голубей", "витаминный комплекс", "корм для крупных попугаев", "корм для канареек", "корм для экзотических птиц", "минеральная смесь"],
    variations: ["150 г", "454 г", "750 г", "1 кг", "3 кг", "5 кг", "набор 3×1 кг", "с добавкой йода", "без сахара", "органический сертификат"]
  },
  reptiles: {
    brands: ["Exo Terra", "Zoo Med", "Repashy", "Arcadia", "ProRep", "Lucky Reptile", "Zilla", "Namiba Terra", "Pangea", "Fluker's"],
    bases: ["Terrarium 60×45×45 cm", "ReptiSun 10.0 UVB Mini", "Crested Gecko Diet", "D3+ Dragon Light 12%", "Bamboo Substrate", "Infrared Heat Lamp 75W", "Aquatic Reptile Filter 30", "Rainforest Bedding", "Fruit Mix Complete", "Buffet Blend Turtle Formula"],
    types: ["стеклянный террариум", "ультрафиолетовая лампа", "полнорационный корм для гекконов", "специализированная UVB лампа", "натуральный субстрат", "инфракрасная лампа обогрева", "фильтр для водных рептилий", "грунт для тропических террариумов", "питательная смесь с насекомыми", "корм для водных черепах"],
    variations: ["340 г", "283 г", "50 L", "20 L", "75W", "100W", "160 г", "170 г", "стандарт", "с крепежом"]
  }
};

export function generateAllProducts() {
  const products = [];
  let id = 1;
  const categories = ['cats', 'dogs', 'fish', 'birds', 'reptiles'];
  const icons = { 
    cats: '🐱', 
    dogs: '🐶', 
    fish: '🐠', 
    birds: '🦜', 
    reptiles: '🦎' 
  };
 
const imageUrls = {
    cats: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop',
      'https://ir.ozone.ru/s3/multimedia-0/6069495192.jpg',
      'https://avatars.mds.yandex.net/i?id=7a42657612b4749129992f0f64ce99eb_l-5558644-images-thumbs&n=13'
    ],
    dogs: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1615266895738-11f1371cd7e5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop'
    ],
    fish: [
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&h=300&fit=crop',
      'https://yt3.googleusercontent.com/ytc/AIdro_mMvkGWu6h3HDTeEAN1h-VaE69fgpNaLtPfaWTfvrj6Tbs=s900-c-k-c0x00ffffff-no-rj'
    ],
    birds: [
      'https://s.yimg.com/ny/api/res/1.2/QXJTWn14O1TLNO5ps4mQFg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA7Y2Y9d2VicA--/https://media.zenfs.com/en/the_spruce_pets_articles_780/d02ca20f26d4a7adbbef1c31b10b9261',
      'https://www.vidal.ru/upload/kcfinder/files/Image/prodolzhitelnost-zhizni-volnistyh-popugaev-v-prirode.jpg',
      'https://d2zp5xs5cp8zlg.cloudfront.net/image-60002-800.jpg'
    ],
    reptiles: [
      'https://avatars.mds.yandex.net/i?id=c50546401b968d3b08438685bd96666b_l-5436907-images-thumbs&n=13',
      'https://avatars.mds.yandex.net/i?id=1e48ff2dd0da9e248e4e01300daafdad_l-5614297-images-thumbs&n=13',
      'https://exomenu.ru/images/detailed/309/IMG_2197.jpg'
    ]
  };
  
  categories.forEach(cat => {
    const data = catalogData[cat];
    

    if (!data) {
      console.error(`Нет данных для категории: ${cat}`);
      return;
    }
    
    for (let i = 0; i < 20; i++) {
      const brand = data.brands[i % data.brands.length];
      const base = data.bases[Math.floor(i / 10) % data.bases.length];
      const type = data.types[i % data.types.length];
      const variation = data.variations[i % data.variations.length];
      const basePrice = 490 + (i * 173) % 24500;
      const price = Math.round(basePrice / 10) * 10;
      
      const catImages = imageUrls[cat] || [];
      const imageUrl = catImages[i % catImages.length] || `https://via.placeholder.com/400x300/4A5ABF/FFFFFF?text=${encodeURIComponent(brand.split(' ')[0])}`;
      
      products.push({
        id: id++,
        name: `${brand} — ${base}`,
        cat: cat,
        price: price,
        oldPrice: i % 7 === 0 ? Math.round(price * 1.2 / 10) * 10 : null,
        badge: i === 0 ? 'Хит' : (i === 1 ? 'Новинка' : (i % 13 === 0 ? 'Элит' : '')),
        icon: icons[cat],
        image: imageUrl,
        desc: `${base} ${type}, ${variation}. Премиальное качество от мирового лидера ${brand}.`,
        variation: variation
      });
    }
  });
  
  return products;
}
export const allProducts = generateAllProducts();