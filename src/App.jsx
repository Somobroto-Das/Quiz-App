import React, { useState, useEffect } from "react";

function App() {
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await fetch(
          "https://quizapi.io/api/v1/questions?apiKey=BJw0fZ6Yf7Jnk4jTv6sSqBMBqR4CDvGfAWCTiped&limit=10"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz questions");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, []);

  const optionClicked = (isCorrect) => {
    // Increment the score if the answer is correct
    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to the next question or show results if all questions are answered
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
  };

  if (loading) {
    return <div className="App text-center">Loading...</div>;
  }

  if (error) {
    return <div className="App text-center">Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div className="App text-center">No questions available</div>;
  }

  const currentQuestionData = questions[currentQuestion];
  const answerOptions = Object.keys(currentQuestionData.answers ?? {}).filter(
    (key) => currentQuestionData.answers[key] !== null
  );

  return (
    <div className="App text-center">
      <h1 className="font-black text-4xl">Random Quiz</h1>
      <h2 className="font-semibold text-xl">Score: {score}</h2>
      <div className="flex flex-col justify-center items-center min-h-screen">
        {showResults ? (
          /* Display final results */
          <div className="final-results m-auto w-1/2 h-auto mt-16 bg-gray-600 text-white shadow-custom">
            <h1>Final Results</h1>
            <h2>
              {score} out of {questions.length} correct - ({((score / questions.length) * 100).toFixed(2)}%)
            </h2>
            <button className="btn btn-outline btn-info" onClick={restartGame}>
              Restart Game
            </button>
          </div>
        ) : (
          /* Display question and filtered answer options */
          <div className="question-card m-auto w-4/5 h-auto bg-gray-600 p-4 rounded-md text-white shadow-custom">
            <h2>
              Question: {currentQuestion + 1} out of {questions.length}
            </h2>
            <h3 className="question-text text-blue-900 text-[24px]">
              {currentQuestionData?.question}
            </h3>
            <ul className="list-none">
              {answerOptions.map((key) => {
                const isCorrect = currentQuestionData.correct_answers[`${key}_correct`] === "true";
                const answerText = currentQuestionData.answers[key];

                return (
                  <li
                    className="mt-2 bg-gray-800 p-4 border-1 border-solid border-white rounded-[20px] text-[20px]"
                    key={key}
                    onClick={() => optionClicked(isCorrect)}
                  >
                    {answerText}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
