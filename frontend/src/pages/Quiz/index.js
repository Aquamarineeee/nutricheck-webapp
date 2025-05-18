import React, { useState, useEffect } from 'react';
import styles from "../../styles/quiz.module.css";

const NutritionQuiz = () => {
  // Danh sách câu hỏi dinh dưỡng
  const questions = [
    {
      question: "Chất dinh dưỡng nào cung cấp nhiều năng lượng nhất mỗi gram?",
      options: ["Protein", "Carbohydrate", "Chất béo", "Vitamin"],
      answer: 2,
      explanation: "Chất béo cung cấp 9 calo mỗi gram, trong khi protein và carbohydrate chỉ cung cấp 4 calo mỗi gram."
    },
    {
      question: "Loại vitamin nào quan trọng cho sự hấp thụ canxi?",
      options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
      answer: 3,
      explanation: "Vitamin D giúp cơ thể hấp thụ canxi từ thực phẩm, rất quan trọng cho xương chắc khỏe."
    },
    {
      question: "Thực phẩm nào giàu chất xơ nhất?",
      options: ["Thịt gà", "Cá hồi", "Đậu lăng", "Trứng"],
      answer: 2,
      explanation: "Đậu lăng và các loại đậu khác là nguồn chất xơ tuyệt vời, giúp hỗ trợ tiêu hóa và giảm cholesterol."
    },
    {
      question: "Khoáng chất nào cần thiết cho chức năng tuyến giáp?",
      options: ["Sắt", "I-ốt", "Kẽm", "Magie"],
      answer: 1,
      explanation: "I-ốt là thành phần thiết yếu của hormone tuyến giáp, giúp điều chỉnh sự trao đổi chất."
    },
    {
      question: "Loại đường nào có trong trái cây?",
      options: ["Glucose", "Fructose", "Sucrose", "Tất cả các loại trên"],
      answer: 3,
      explanation: "Trái cây chứa nhiều loại đường tự nhiên bao gồm glucose, fructose và sucrose."
    }
  ];

  // State management
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Khởi tạo quiz
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const handleSelectOption = (option, correct) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    if (correct) setScore(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    const reshuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(reshuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizCompleted(false);
  };

  const renderQuestion = () => {
    if (shuffledQuestions.length === 0 || quizCompleted) return null;
    
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
              {currentQuestion.explanation}
            </div>
            <button className={styles.nextBtn} onClick={handleNextQuestion}>
              {currentQuestionIndex < shuffledQuestions.length - 1 
                ? "Câu hỏi tiếp theo" 
                : "Xem kết quả"}
            </button>
          </>
        )}
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
      {renderQuestion()}
      {renderResult()}
    </div>
  );
};

export default NutritionQuiz;