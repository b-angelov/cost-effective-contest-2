import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/ArticlesList.css';
import Article from './Article';

// Анимационни варианти
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const ArticlesList = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const openArticle = (article) => {
    setSelectedArticle(article);
  };

  return (
    <div className="articles-list-section">
      <h2 className="articles-title">Красиви места в България</h2>
      <p className="articles-subtitle">Открийте невероятни дестинации за вашата следваща фотографска експедиция</p>
      
      <motion.div 
        className="articles-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {Object.values(articles).map((article) => (
          <motion.div 
            key={article.id} 
            className="article-card"
            variants={fadeInUp}
            onClick={() => openArticle(article)}
            whileHover={{ y: -10, scale: 1.02 }}
            style={{ backgroundImage: `url(${article.backgroundImage})` }}
          >
            <div className="article-card-content">
              <div className="article-card-icon">{article.icon}</div>
              <h3 className="article-card-title">{article.title}</h3>
              <p className="article-card-info">
                <span className="article-card-date">{article.date}</span>
                <span className="article-divider">•</span>
                <span className="article-card-author">{article.author}</span>
              </p>
              <div className="article-card-read-more">
                Прочетете повече
                <span className="read-more-arrow">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {selectedArticle && (
        <Article 
          article={selectedArticle} 
          onClose={closeArticle}
        />
      )}
    </div>
  );
};

export default ArticlesList; 