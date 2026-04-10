const API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL

/**
 * Checks the answer for a specific question via the API.
 * @param {number} questionId 
 * @param {string} selectedOption 
 * @returns {Promise<{isCorrect: boolean, explanation?: string}>}
 */
export const checkAnswer = async (questionId, selectedOption) => {
  try {
    const response = await fetch(`${API_BASE_URL}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, answer: selectedOption }),
    });
    if (!response.ok) throw new Error("API Error");
    return await response.json();
  } catch (error) {
    console.error("Check Answer Error:", error);
    return null;
  }
};

/**
 * Submits the final quiz results to the API.
 * @param {Object} results 
 */
export const submitQuiz = async (results) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(results),
    });
    return await response.json();
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    return null;
  }
};
