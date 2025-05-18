import React, { useState, useEffect } from 'react';
import styles from "../../styles/quiz.module.css";
import questionsData from './nutritionQuestions.json';
import Confetti from 'react-confetti';
import { Rain } from 'react-rainfall';

const NutritionQuiz = () => {
  // GIF images array
  const gifImages = [
    "https://i.pinimg.com/originals/9d/7a/d1/9d7ad1eaa2948a05bd1a8a6412f3a753.gif",
    "https://i.pinimg.com/originals/bf/87/c8/bf87c88e5afe1f85944b9798b844aa0f.gif",
    "https://i.pinimg.com/originals/64/8a/7c/648a7ce812bb33c5c01c6766e4c308a6.gif",
    "https://i.pinimg.com/originals/df/ef/2f/dfef2fb54bf820f19c3631a966e03dfb.gif",
    "https://i.pinimg.com/originals/48/d4/2a/48d42a90d4f3b7b7a0249b35b2f59403.gif",
    "https://i.pinimg.com/originals/5e/6c/1b/5e6c1b3cbce1d9a066683e7a2e2fb2b5.gif",
    "https://i.pinimg.com/originals/8a/4d/5e/8a4d5e7b342fa90ed8f6fb37c7084dd7.gif",
    "https://i.pinimg.com/originals/f4/c3/cc/f4c3cc6e4872d95d98456435577e56b3.gif",
    "https://i.pinimg.com/originals/9b/d6/c6/9bd6c6cc39a44f007d675e34f4ad7f22.gif",
    "https://i.pinimg.com/originals/bc/11/80/bc11809c97271e15b7495b7ccd880ab7.gif"
  ];

  const QUESTION_LIMIT = 5;

  // Inspirational quotes
  const inspirationalQuotes = [
    {
      quote: '"Có thực mới vực được đạo."',
      message: "Ăn uống đầy đủ là nền tảng cho sức khỏe và trí tuệ."
    },
    {
      quote: '"Ăn trông nồi, ngồi trông hướng."',
      message: "Ăn uống điều độ, có chừng mực, biết giữ ý tứ."
    },
    {
      quote: '"Hãy để thức ăn là thuốc, và thuốc là thức ăn." – Hippocrates',
      message: "Dinh dưỡng là gốc rễ của sức khỏe."
    },
    {
      quote: '"Bạn chính là những gì bạn ăn." – Ludwig Feuerbach',
      message: "Cơ thể và sức khỏe phản ánh chế độ ăn uống."
    },
    {
      quote: '"Ăn sạch, sống xanh."',
      message: "Ăn uống lành mạnh giúp sống khỏe mạnh."
    }
  ];

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [currentGif, setCurrentGif] = useState("");
  const [currentQuote, setCurrentQuote] = useState({ quote: "", message: "" });

  // Initialize quiz with 5 random questions
  useEffect(() => {
    const shuffled = [...questionsData]
      .sort(() => Math.random() - 0.5)
      .slice(0, QUESTION_LIMIT);
    setQuestions(shuffled);
  }, []);

  const handleSelectOption = (option, correct) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    if (correct) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setShowRain(true);
      setTimeout(() => setShowRain(false), 2000);
    }
  };

  const showRandomInspiration = () => {
    const randomGif = gifImages[Math.floor(Math.random() * gifImages.length)];
    const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
    
    setCurrentGif(randomGif);
    setCurrentQuote(randomQuote);
    setShowInspiration(true);
  };

  const handleNextQuestion = () => {
    if (showInspiration) {
      setShowInspiration(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizCompleted(true);
      }
    } else {
      showRandomInspiration();
    }
  };

  const handleRestart = () => {
    const reshuffled = [...questionsData]
      .sort(() => Math.random() - 0.5)
      .slice(0, QUESTION_LIMIT);
    setQuestions(reshuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizCompleted(false);
    setShowInspiration(false);
  };

  const renderQuestion = () => {
    if (questions.length === 0 || quizCompleted || showInspiration) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswerText = currentQuestion.options[currentQuestion.answer];
    const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);

    return (
      <div className={styles.quizContainer}>
        {showConfetti && (
          <Confetti 
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        
        {showRain && (
          <div className={styles.rainContainer}>
            <Rain 
              dropletsAmount={100}
              opacity={0.5}
              animationSpeed={2}
            />
          </div>
        )}
        
        <div className={styles.score}>
          Câu hỏi: {currentQuestionIndex + 1}/{QUESTION_LIMIT} | Điểm: {score}
        </div>
        
        <div className={styles.progress}>
          <div 
            className={styles.progressBar} 
            style={{ 
              width: `${((currentQuestionIndex + 1) / QUESTION_LIMIT) * 100}%` 
            }}
          />
        </div>
        
        <h2 className={styles.question}>{currentQuestion.question}</h2>
        
        <div className={styles.options}>
          {shuffledOptions.map((option, index) => {
            const isCorrect = option === correctAnswerText;
            let optionClass = styles.option;
            
            if (selectedOption === option) {
              optionClass += isCorrect ? ` ${styles.correct}` : ` ${styles.incorrect}`;
            } else if (selectedOption !== null && isCorrect) {
              optionClass += ` ${styles.correct}`;
            }
            
            return (
              <div
                key={index}
                className={optionClass}
                onClick={() => handleSelectOption(option, isCorrect)}
              >
                {option}
              </div>
            );
          })}
        </div>
        
        {selectedOption && (
          <>
            <div className={styles.explanation}>
              <p>{currentQuestion.explanation}</p>
              {currentQuestion.source && (
                <p className={styles.source}>Nguồn: {currentQuestion.source}</p>
              )}
            </div>
            <button className={styles.nextBtn} onClick={handleNextQuestion}>
              {!showInspiration 
                ? "Xem thông điệp truyền cảm hứng" 
                : currentQuestionIndex < questions.length - 1 
                  ? "Câu hỏi tiếp theo" 
                  : "Xem kết quả"}
            </button>
          </>
        )}
      </div>
    );
  };

  const renderInspiration = () => {
    if (!showInspiration) return null;
    
    return (
      <div className={styles.inspirationContainer}>
        <div className={styles.gifContainer}>
          <img 
            src={currentGif} 
            alt="Thông điệp sức khỏe" 
            className={styles.inspirationGif}
          />
        </div>
        
        <div className={styles.quoteContainer}>
          <blockquote className={styles.quote}>
            {currentQuote.quote}
          </blockquote>
          <p className={styles.message}>
            {currentQuote.message}
          </p>
        </div>
        
        <button className={styles.nextBtn} onClick={handleNextQuestion}>
          {currentQuestionIndex < questions.length - 1 
            ? "Câu hỏi tiếp theo" 
            : "Xem kết quả"}
        </button>
      </div>
    );
  };



  const renderResult = () => {
    if (!quizCompleted) return null;

  // Lấy ảnh gif và thông điệp ngẫu nhiên
  const gif = gifImages[Math.floor(Math.random() * gifImages.length)];
  const quote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  return (
    <div className={styles.quizContainer}>
      <Confetti 
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={300}
      />

      <div className={styles.gifContainer}>
        <img src={gif} alt="Chúc mừng" className={styles.inspirationGif} />
      </div>

      <h2 className={styles.question}>
        🎉 Chúc mừng! Bạn đã trả lời đúng {score}/{QUESTION_LIMIT} câu hỏi, hãy cố gắng rèn luyện sức khỏe bản thân nhé! 🎉
      </h2>

      <blockquote className={styles.quote}>
        {quote.quote}
      </blockquote>
      <p className={styles.message}>
        {quote.message}
      </p>

      <button className={styles.nextBtn} onClick={handleRestart}>
        Chơi lại
      </button>
    </div>
    );
  };

  return (
    <div className={styles.nutritionQuiz}>
      <h1>Kiến thức dinh dưỡng (5 câu/lần)</h1>
      {!showInspiration && renderQuestion()}
      {renderInspiration()}
      {renderResult()}
    </div>
  );
};

export default NutritionQuiz;
