import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import styles from "../../styles/quiz.module.css";
import questionsData from './nutritionQuestions.json';
=======
import styles from '../../styles/quiz.module.css'; // Sử dụng CSS Modules
>>>>>>> 3d6870b2f2d3a0af472ffbba547faf877d28abec

const NutritionQuiz = () => {
  // Danh sách hình ảnh GIF
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

  // Danh sách câu nói truyền cảm hứng
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
    },
    {
      quote: '"Cơ thể bạn là ngôi nhà duy nhất bạn không thể rời đi – hãy chăm sóc nó."',
      message: "Sức khỏe là nhà, là nơi trú ẩn suốt đời."
    },
    {
      quote: '"Sức khỏe là khoản đầu tư, không phải là chi phí."',
      message: "Đầu tư cho sức khỏe là khôn ngoan nhất."
    },
    {
      quote: '"Mỗi bữa ăn là cơ hội để chữa lành."',
      message: "Thức ăn có thể là thuốc nếu ta chọn đúng."
    }
  ];

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [currentGif, setCurrentGif] = useState("");
  const [currentQuote, setCurrentQuote] = useState({ quote: "", message: "" });


  useEffect(() => {
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const handleSelectOption = (option, correct) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    if (correct) setScore(prev => prev + 1);
  };

  const showRandomInspiration = () => {
    // Chọn ngẫu nhiên hình ảnh và câu nói
    const randomGif = gifImages[Math.floor(Math.random() * gifImages.length)];
    const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
    
    setCurrentGif(randomGif);
    setCurrentQuote(randomQuote);
    setShowInspiration(true);
  };

  const handleNextQuestion = () => {
    if (showInspiration) {
      // Đã xem hình ảnh/câu nói, chuyển sang câu hỏi tiếp theo
      setShowInspiration(false);
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizCompleted(true);
      }
    } else {
      // Hiển thị hình ảnh/câu nói trước khi chuyển câu hỏi
      showRandomInspiration();
    }
  };

  const handleRestart = () => {
    const reshuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setShuffledQuestions(reshuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizCompleted(false);
    setShowInspiration(false);
  };

  const renderQuestion = () => {
    if (shuffledQuestions.length === 0 || quizCompleted || showInspiration) return null;
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correctAnswerText = currentQuestion.options[currentQuestion.answer];
    const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);

    return (
      <div className={styles.quizContainer}>
        <div className={styles.score}>
          Điểm: {score}/{shuffledQuestions.length}
        </div>
        
        <div className={styles.progress}>
          <div 
            className={styles.progressBar} 
            style={{ 
              width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` 
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
              Xem thông điệp truyền cảm hứng
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
          {currentQuestionIndex < shuffledQuestions.length - 1 
            ? "Câu hỏi tiếp theo" 
            : "Xem kết quả"}
        </button>
      </div>
    );
  };

  const renderResult = () => {
    if (!quizCompleted) return null;
    
    return (
      <div className={styles.quizContainer}>
        <h2 className={styles.question}>
          Hoàn thành! Bạn đã trả lời đúng {score}/{shuffledQuestions.length} câu hỏi!
        </h2>
        <button className={styles.nextBtn} onClick={handleRestart}>
          Chơi lại
        </button>
      </div>
    );
  };

  return (
    <div className={styles.nutritionQuiz}>
      <h1>Kiến thức dinh dưỡng</h1>
      {!showInspiration && renderQuestion()}
      {renderInspiration()}
      {renderResult()}
    </div>
  );
};

export default NutritionQuiz;
