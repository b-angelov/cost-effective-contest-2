import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import './styles/App.css'
import Article from './components/Article'
import ArticlesList from './components/ArticlesList'
import articleData from './constants/articleData'

// Импортиране на изображения за пейзажи през прозорци
const woodPlanksBackground = "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?q=80&w=2070"; // Дървен фон
const woodPlanksLight = "https://images.unsplash.com/photo-1599837789170-42a6a206d9a3?q=80&w=1200"; // По-тъмна дървена текстура
const naturalLandscapeLeft = "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=2070"; // Езерен пейзаж с планини
const naturalLandscapeRight = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070"; // Планински пейзаж със слънце
const naturalLandscapeFooter = "https://images.unsplash.com/photo-1505224628533-c4fc42c9b10f?q=80&w=2070"; // Широк планински пейзаж
const woodFrameTexture = "https://images.unsplash.com/photo-1561129458-b62b5843d6e2?q=80&w=1200"; // Текстура за дървените рамки
const woodGrainTexture = "https://images.unsplash.com/photo-1541233349642-6e425fe6190e?q=80&w=1200"; // Текстура за дървени елементи

// Изображения за карусела с пейзажи
const carouselImages = [
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2070", // Планини с мъгла
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070", // Планини и езеро на залез
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070", // Планинско езеро с отражение
  "https://images.unsplash.com/photo-1443632864897-14973fa006cf?q=80&w=2070", // Красив зелен планински пейзаж
  "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?q=80&w=2070"  // Планини с цветя
];

// Анимационни варианти за Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.165, 0.84, 0.44, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

function App() {
  const [hoverWindow, setHoverWindow] = useState(null);
  const { scrollY } = useScroll();
  const [isInView, setIsInView] = useState({
    features: false,
    testimonial: false,
    header: false,
    carousel: false,
    about: false
  });
  
  const [currentImage, setCurrentImage] = useState(0);
  const [email, setEmail] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticlesList, setShowArticlesList] = useState(false);
  
  // Refs за проследяване на видимостта
  const featuresRef = useRef(null);
  const testimonialRef = useRef(null);
  const headerRef = useRef(null);
  const carouselRef = useRef(null);
  const aboutRef = useRef(null);
  
  // Паралакс ефекти със скрола
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);
  const leftLandscapeY = useTransform(scrollY, [0, 1000], [0, -150]);
  const rightLandscapeY = useTransform(scrollY, [0, 1000], [0, -100]);
  const archOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);
  const contentScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  
  // Функция за отваряне на статия
  const openArticle = (articleId) => {
    setSelectedArticle(articleData[articleId]);
  };
  
  // Функция за затваряне на статия
  const closeArticle = () => {
    setSelectedArticle(null);
  };

  // Функция за показване/скриване на списъка със статии
  const toggleArticlesList = () => {
    setShowArticlesList(!showArticlesList);
  };
  
  // Ефект за автоматично сменяне на изображенията в карусела
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Ефект за проверка на елементите във видимата област
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };
    
    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === featuresRef.current) {
            setIsInView(prev => ({ ...prev, features: true }));
          } else if (entry.target === testimonialRef.current) {
            setIsInView(prev => ({ ...prev, testimonial: true }));
          } else if (entry.target === headerRef.current) {
            setIsInView(prev => ({ ...prev, header: true }));
          } else if (entry.target === carouselRef.current) {
            setIsInView(prev => ({ ...prev, carousel: true }));
          } else if (entry.target === aboutRef.current) {
            setIsInView(prev => ({ ...prev, about: true }));
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (testimonialRef.current) observer.observe(testimonialRef.current);
    if (headerRef.current) observer.observe(headerRef.current);
    if (carouselRef.current) observer.observe(carouselRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    
    return () => {
      if (featuresRef.current) observer.unobserve(featuresRef.current);
      if (testimonialRef.current) observer.unobserve(testimonialRef.current);
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (carouselRef.current) observer.unobserve(carouselRef.current);
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);
  
  return (
    <div className="landing-page">
      {/* Фоново изображение с реална дървена текстура */}
      <motion.div 
        className="wood-background"
        style={{ y: backgroundY }}
      >
        <img src={woodPlanksBackground} alt="" />
        <div className="wood-texture-overlay"></div>
      </motion.div>
      
      {/* Прозорци с изглед към природни пейзажи */}
      <motion.div 
        className={`window-view left ${hoverWindow === 'left' ? 'window-hover' : ''}`}
        style={{ 
          y: leftLandscapeY
        }}
        onMouseEnter={() => setHoverWindow('left')}
        onMouseLeave={() => setHoverWindow(null)}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Дървена рамка на прозореца */}
        <div className="window-frame" style={{ backgroundImage: `url(${woodFrameTexture})` }}>
          {/* Пейзаж, видим през прозореца */}
          <div className="window-landscape" style={{ backgroundImage: `url(${naturalLandscapeLeft})` }}></div>
          
          <div className="window-shadow"></div>
          <div className="window-reflection"></div>
        </div>
      </motion.div>
      
      <motion.div 
        className={`window-view right ${hoverWindow === 'right' ? 'window-hover' : ''}`}
        style={{ 
          y: rightLandscapeY
        }}
        onMouseEnter={() => setHoverWindow('right')}
        onMouseLeave={() => setHoverWindow(null)}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Дървена рамка на прозореца */}
        <div className="window-frame" style={{ backgroundImage: `url(${woodFrameTexture})` }}>
          {/* Пейзаж, видим през прозореца */}
          <div className="window-landscape" style={{ backgroundImage: `url(${naturalLandscapeRight})` }}></div>
          
          <div className="window-shadow"></div>
          <div className="window-reflection"></div>
        </div>
      </motion.div>
      
      {/* Горна арка с реална дървена текстура */}
      <motion.div 
        className="arch-top wooden-edge" 
        style={{ 
          backgroundImage: `url(${woodPlanksLight})`,
          opacity: archOpacity
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
      </motion.div>
      
      <div className="wooden-arch">
        <motion.div 
          className="content-container"
          style={{ scale: contentScale }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.165, 0.84, 0.44, 1]
          }}
        >
          <motion.div 
            ref={headerRef}
            initial="hidden"
            animate={isInView.header ? "visible" : "hidden"}
            variants={fadeInUp}
            className="header-content"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="light-text"
            >
              Прекрасните Пейзажи на България
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="light-text"
            >
              Докосване до хоризонта
            </motion.h2>
            
            <motion.p 
              className="lead-text light-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Насладете се на невероятни гледки от нашия уютен кът, където прозорците разкриват спиращи дъха пейзажи от цял свят.
            </motion.p>
          </motion.div>
          
          <motion.div 
            ref={featuresRef}
            id="articles-section"
            className="features-section"
          >
            <h2 className="section-title">Пейзажна Красота</h2>
            <div className="features"
              variants={staggerContainer}
              initial="hidden"
              animate={isInView.features ? "visible" : "hidden"}
            >
            <motion.div 
              className="feature wooden-feature" 
              variants={fadeInUp} 
              style={{ backgroundImage: `url(${woodPlanksLight})` }}
              onClick={() => openArticle('mountains')}
            >
              <div className="feature-icon-container">
                <motion.div 
                  className="feature-icon"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🏔️
                </motion.div>
                <div className="feature-icon-bg"></div>
              </div>
              <h3>Планински Красоти</h3>
              <p>Спиращи дъха планински вериги и върхове, покрити със сняг през зимата и с буйна зеленина през夏天</p>
            </motion.div>
            
            <motion.div 
              className="feature wooden-feature" 
              variants={fadeInUp} 
              style={{ backgroundImage: `url(${woodPlanksLight})` }}
              onClick={() => openArticle('lakes')}
            >
              <div className="feature-icon-container">
                <motion.div 
                  className="feature-icon"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🌊
                </motion.div>
                <div className="feature-icon-bg"></div>
              </div>
              <h3>Кристални Езера</h3>
              <p>Прозрачни води, отразяващи небето, заобиколени от величествени планини и пищна растителност</p>
            </motion.div>
            
            <motion.div 
              className="feature wooden-feature" 
              variants={fadeInUp} 
              style={{ backgroundImage: `url(${woodPlanksLight})` }}
              onClick={() => openArticle('forests')}
            >
              <div className="feature-icon-container">
                <motion.div 
                  className="feature-icon"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🌲
                </motion.div>
                <div className="feature-icon-bg"></div>
              </div>
              <h3>Вековни Гори</h3>
              <p>Величествени гори с вековни дървета, създаващи усещане за спокойствие и връзка с природата</p>
            </motion.div>
            </div>
          </motion.div>
          
          <div className="cta-section">
            <motion.button 
              className="cta-button wooden-button"
              style={{ backgroundImage: `url(${woodGrainTexture})` }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                toggleArticlesList();
              }}
            >
              <span className="button-text">Открийте Красотата</span>
              <motion.span 
                className="button-arrow"
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "loop", 
                  duration: 1.5,
                  ease: "easeInOut" 
                }}
              >
                →
              </motion.span>
            </motion.button>
          </div>
          
          <motion.div 
            ref={testimonialRef}
            className="testimonials wooden-testimonial"
            style={{ backgroundImage: `url(${woodPlanksLight})` }}
            initial="hidden"
            animate={isInView.testimonial ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <blockquote>
              "Гледката от прозореца е толкова зашеметяваща, че имам чувството, че съм част от самата природа. Тези моменти на съзерцание са безценни!"
              <footer>— Елена Петрова</footer>
            </blockquote>
          </motion.div>
          
          {/* Секция "За нас" */}
          <motion.div
            ref={aboutRef}
            className="about-section wooden-section"
            style={{ backgroundImage: `url(${woodPlanksLight})` }}
            initial="hidden"
            animate={isInView.about ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="section-title">За нас</h2>
            <div className="about-content">
              <div className="about-text">
                <p>
                  "Прекрасните Пейзажи на България" е проект, роден от любовта към природните красоти на нашата страна. 
                  Започнахме през 2018 година като малка група ентусиасти, които обичат да фотографират и споделят 
                  българските пейзажи.
                </p>
                <p>
                  Днес нашата мисия е да покажем на света уникалната красота на България - от величествените планини 
                  и кристални езера до тихите гори и живописни долини. Вярваме, че красотата на природата трябва да се 
                  съхранява и ценя от всички.
                </p>
              </div>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">7500+</span>
                  <span className="stat-label">Фотографии</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">120+</span>
                  <span className="stat-label">Локации</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">45+</span>
                  <span className="stat-label">Фотографи</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Форма за абонамент */}
          <div 
            className="subscription-form wooden-section"
            style={{ 
              backgroundImage: `url(${woodPlanksLight})`,
            }}
          >
            <div className="subscription-form-content">
              <h3>Абонирайте се за нашия бюлетин</h3>
              <p>Получавайте първи най-новите снимки и информация за предстоящи събития</p>
              <div className="form-container">
                <input 
                  type="email" 
                  placeholder="Вашият имейл адрес" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                />
                <motion.button 
                  className="subscribe-button wooden-button"
                  style={{ backgroundImage: `url(${woodGrainTexture})` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="button-text">Абонирай се</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="wood-strip wooden-edge" 
        style={{ backgroundImage: `url(${woodPlanksLight})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      ></motion.div>
      
      {/* Футър с панорамен изглед */}
      <footer className="main-footer panoramic-view">
        <div className="footer-window">
          <div className="footer-window-frame">
            <div className="footer-landscape" style={{ backgroundImage: `url(${naturalLandscapeFooter})` }}></div>
          </div>
        </div>
        
        {/* Карусел за пейзажи в долната част на страницата */}
        <div className="footer-carousel">
          <div className="carousel-title">
            <h2 className="light-text">Прекрасните Пейзажи на България</h2>
          </div>
          
          <div className="carousel-container">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="carousel-slide"
              >
                <div className="carousel-image" style={{ backgroundImage: `url(${carouselImages[currentImage]})` }}></div>
                <div className="carousel-image-overlay"></div>
                <div className="wooden-frame-overlay"></div>
              </motion.div>
            </AnimatePresence>
            
            <div className="carousel-button carousel-button-prev" onClick={() => setCurrentImage(prev => (prev === 0 ? carouselImages.length - 1 : prev - 1))}>
              &#10094;
            </div>
            <div className="carousel-button carousel-button-next" onClick={() => setCurrentImage(prev => (prev === carouselImages.length - 1 ? 0 : prev + 1))}>
              &#10095;
            </div>
            
            <div className="carousel-indicators">
              {carouselImages.map((_, index) => (
                <div 
                  key={index} 
                  className={`carousel-indicator ${index === currentImage ? 'active' : ''}`}
                  onClick={() => setCurrentImage(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="footer-content">
          <div className="footer-columns">
            <div className="footer-column">
              <h3 className="light-text">Навигация</h3>
              <div className="footer-links">
                <a href="#" className="footer-link light-text">Начало</a>
                <a href="#" className="footer-link light-text">За нас</a>
                <a href="#" className="footer-link light-text">Галерия</a>
                <a href="#" className="footer-link light-text">Контакти</a>
                <a href="#" className="footer-link light-text">Поверителност</a>
              </div>
            </div>
            
            <div className="footer-column">
              <h3 className="light-text">Контакти</h3>
              <p className="contact-info light-text">
                <span className="contact-item">📞 +359 88 555 4321</span>
                <span className="contact-item">✉️ info@bulgaria-landscapes.bg</span>
                <span className="contact-item">📍 ул. Витоша 25, София 1000</span>
              </p>
              <div className="social-links">
                <a href="#" className="social-link light-text">Facebook</a>
                <a href="#" className="social-link light-text">Instagram</a>
                <a href="#" className="social-link light-text">YouTube</a>
              </div>
            </div>
            
            <div className="footer-column">
              <h3 className="light-text">Работно време</h3>
              <p className="contact-info light-text">
                <span className="contact-item">Понеделник - Петък: 9:00 - 18:00</span>
                <span className="contact-item">Събота: 10:00 - 16:00</span>
                <span className="contact-item">Неделя: Затворено</span>
              </p>
            </div>
          </div>
          
          <div className="copyright">
            <p className="light-text">© 2024 Прекрасни Пейзажи на България. Всички права запазени.</p>
            <p className="light-text small-text">Изображенията, представени на този сайт, са защитени с авторски права и не могат да бъдат използвани без писмено разрешение.</p>
          </div>
        </div>
      </footer>
      
      {/* Модален прозорец за списъка със статии */}
      <AnimatePresence>
        {showArticlesList && (
          <motion.div 
            className="articles-list-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleArticlesList}
          >
            <motion.div 
              className="articles-list-modal wooden-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundImage: `url(${woodPlanksLight})` }}
            >
              <button className="close-button" onClick={toggleArticlesList}>×</button>
              <ArticlesList articles={articleData} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Модален прозорец за статиите */}
      <AnimatePresence>
        {selectedArticle && (
          <Article 
            article={selectedArticle} 
            onClose={closeArticle}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App 