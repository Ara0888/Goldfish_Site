const GoldfishIcon = ({ size = 40, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Золотой градиент для рыбки */}
      <linearGradient id="fishGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="100%" stopColor="#FF8C00"/>
      </linearGradient>
      
      {/* Золотой градиент для рамки */}
      <linearGradient id="borderGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="50%" stopColor="#FFA500"/>
        <stop offset="100%" stopColor="#FFD700"/>
      </linearGradient>
    </defs>
    
    {/* Голубой фон кружка */}
    <circle 
      cx="50" 
      cy="50" 
      r="48" 
      fill="#4FC3F7"
    />
    
    {/* Золотая рамка */}
    <circle 
      cx="50" 
      cy="50" 
      r="46" 
      fill="none" 
      stroke="url(#borderGoldGradient)" 
      strokeWidth="3"
    />
    
    {/* Тело рыбки */}
    <ellipse 
      cx="50" 
      cy="50" 
      rx="25" 
      ry="18" 
      fill="url(#fishGoldGradient)"
      transform="rotate(-10 50 50)"
    />
    
    {/* Хвост */}
    <path 
      d="M 25 50 L 10 35 L 10 65 Z" 
      fill="url(#fishGoldGradient)"
    />
    
    {/* Верхний плавник */}
    <path 
      d="M 45 32 Q 50 20 55 32" 
      fill="url(#fishGoldGradient)"
    />
    
    {/* Нижний плавник */}
    <path 
      d="M 45 68 Q 50 80 55 68" 
      fill="url(#fishGoldGradient)"
    />
    
    {/* Глаз */}
    <circle 
      cx="62" 
      cy="46" 
      r="3" 
      fill="#1a3a52"
    />
    <circle 
      cx="63" 
      cy="45" 
      r="1" 
      fill="white"
    />
    
    {/* Жабры */}
    <path 
      d="M 58 40 Q 60 50 58 60" 
      stroke="#FF8C00" 
      strokeWidth="1.5" 
      fill="none"
      opacity="0.6"
    />
  </svg>
);

export default GoldfishIcon;