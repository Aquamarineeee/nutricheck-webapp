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
    "https://i.pinimg.com/originals/bc/11/80/bc11809c97271e15b7495b7ccd880ab7.gif",
    "https://i.pinimg.com/originals/ba/87/d7/ba87d75073515bade98717d3fa8fc0f6.gif",
    "https://i.pinimg.com/originals/43/5e/cf/435ecf8d0bde12893525daab8c44a380.gif", 
    "https://i.pinimg.com/originals/5a/11/80/5a11807b7c013d1bf6fe8e8f8437d6e4.gif", 
    "https://i.pinimg.com/originals/49/56/cf/4956cfb7a682a861a9888c5b05807016.gif", 
    "https://i.pinimg.com/originals/01/a7/d5/01a7d5698cbd0d5ae4af46fe70ac8003.gif", 
    "https://i.pinimg.com/originals/14/6d/3e/146d3e03455c893e1c3ad4b373a95154.gif", 
    "https://i.pinimg.com/originals/b0/1c/ea/b01cea84ac07cedf97fdc99e02a24fa4.gif",
    "https://i.pinimg.com/originals/b0/3f/38/b03f383ac3a7ad7bcf28204503b554c3.gif", 
    "https://i.pinimg.com/originals/da/58/e1/da58e1660e4c50f05e718d1af49fe415.gif", 
    "https://i.pinimg.com/originals/0e/9c/fb/0e9cfb2057109b64707295e480e4e302.gif",
    "https://i.pinimg.com/originals/42/b2/7b/42b27bbba6a9094b5454957ecc28360b.gif",
    "https://i.pinimg.com/originals/6d/84/8f/6d848f6ee35a0dc8f363e87f515dc2e4.gif",
    "https://i.pinimg.com/originals/43/d2/23/43d223fbcd3cd1fd9bee5b805ca21f64.gif", 
    "https://i.pinimg.com/originals/84/61/c6/8461c69a5325da570dd31dadbfc87a17.gif",
    "https://i.pinimg.com/originals/09/9b/69/099b69f93a49f99e55d205ba8614df04.gif" 
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
    },
    { 
      quote: '"Tập thể dục không phải là sự trừng phạt vì đã ăn, mà là kỷ niệm với cơ thể." – Unknown',
      message: 'Tập luyện là hành động yêu thương bản thân.'
    },
    {
      quote: '"Một quả táo mỗi ngày giúp bạn tránh xa bác sĩ." – Tục ngữ phương Tây',
      message : 'Trái cây giàu dưỡng chất giúp ngừa bệnh.'
    },
    {
      quote: '"Sức khỏe là mối quan hệ giữa bạn và chính cơ thể mình." – Terri Guillemets',
      message : 'Trái cây giàu dưỡng chất giúp ngừa bệnh.'
    },
    {
      quote: '"Nước là chất dinh dưỡng bị lãng quên nhiều nhất." – FAO 2023',
      message : 'Uống đủ nước quan trọng không kém ăn uống.'
    },
    {
      quote: '"Phòng bệnh hơn chữa bệnh."',
      message : 'Phòng ngừa bằng lối sống lành mạnh là quan trọng.'
    },
    {
      quote: '"Ăn chín uống sôi."',
      message : 'Ăn uống vệ sinh để phòng bệnh.'
    }
    ,{
      quote: '"Thuốc bổ không bằng ăn no, thuốc lo không bằng cười sảng khoái."',
      message : 'Chế độ ăn và tinh thần tốt hơn cả thuốc thang.'
    },
    {
      quote: '"Người khỏe là người không bệnh."',
      message : 'Sức khỏe quý hơn vàng.'
    },
    {
      quote: '"Giấc ngủ là phương thuốc chữa lành miễn phí và hiệu quả nhất." – Matthew Walker',
      message : 'Giấc ngủ chất lượng quan trọng như chế độ ăn.'
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

  const gif = gifImages[Math.floor(Math.random() * gifImages.length)];
  const quote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  return (
    <div className={styles.quizContainer} style={{ textAlign: 'center' }}>
      <Confetti 
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={300}
      />

      <div className={styles.gifContainer} style={{ margin: '0 auto' }}>
        <img src={gif} alt="Chúc mừng" className={styles.inspirationGif} />
      </div>

      <h2 className={styles.question} style={{ margin: '20px auto', maxWidth: '800px' }}>
        🎉 Chúc mừng! Bạn đã trả lời đúng {score}/{QUESTION_LIMIT} câu hỏi, hãy cố gắng rèn luyện sức khỏe bản thân nhé! 🎉
      </h2>

      <blockquote className={styles.quote} style={{ margin: '20px auto', maxWidth: '600px', fontSize: '1.2em' }}>
        {quote.quote}
      </blockquote>
      <p className={styles.message} style={{ margin: '20px auto', maxWidth: '600px' }}>
        {quote.message}
      </p>

      <button 
        className={styles.nextBtn} 
        onClick={handleRestart}
        style={{
          fontSize: '1.5em',
          padding: '15px 30px',
          margin: '30px auto',
          display: 'block'
        }}
      >
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
