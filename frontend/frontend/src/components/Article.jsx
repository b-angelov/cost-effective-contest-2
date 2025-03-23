import { motion } from 'framer-motion';
import { useEffect } from 'react';
import '../styles/Article.css';

// Анимационни варианти
const fadeIn = {
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

const Article = ({ article, onClose }) => {
  // Затваряне при натискане на Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    // Забраняване на скролване на основния документ
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'visible';
    };
  }, [onClose]);

  return (
    <motion.div 
      className="article-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="article-container wooden-section"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="article-content">
          <motion.div 
            className="article-header"
            variants={fadeIn}
          >
            <span className="article-icon">{article.icon}</span>
            <h2>{article.title}</h2>
          </motion.div>
          
          <motion.div 
            className="article-body"
            variants={fadeIn}
          >
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </motion.div>
          
          {article.image && (
            <motion.div 
              className="article-image-container"
              variants={fadeIn}
            >
              <img 
                src={article.image} 
                alt={article.title} 
                className="article-image" 
              />
              <div className="wooden-frame-overlay"></div>
            </motion.div>
          )}
          
          <motion.div 
            className="article-footer"
            variants={fadeIn}
          >
            <span className="article-date">{article.date}</span>
            <span className="article-author">{article.author}</span>
          </motion.div>
          
          {article.externalLink && (
            <motion.div
              className="article-external-link"
              variants={fadeIn}
            >
              <a 
                href={article.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link-button"
              >
                Прочетете пълната статия
                <span className="external-link-icon">↗</span>
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Article; 