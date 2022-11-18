import { getData, getAllData } from "./database.mjs"

/**
 * @typedef {Object} user
 * @property {string} username
 * @property {string} password
 * @property {string} email
 */

/**
 * Get user data
 * @param {*} valueToGet 
 * @param {string} property default is username
 * @returns {Promise<user>} user data
 */
export function getUser(valueToGet, property = "username") {
	return getData("user", [property], [valueToGet]);
}

export function getQuizzesOf(creator) {
	return getAllData("quiz", ["creator"], [creator]);
}

export async function getQuizByName(creator, quizName) {
	let quiz = await getData("quiz", ["name", "creator"], [quizName, creator]);
	quiz.questions = await getAllData(questions, "quizId", quiz.id);
	return quiz;
}

/**
 * Get quiz data, along with all of its questions
 * @param {*} valueToGet 
 * @param {string} property 
 * @returns {quiz} 
 */
export async function getQuiz(valueToGet, property = "id") {
	let quiz = await getData("quiz", [property], [valueToGet]);
	quiz.questions = await getData(questions, "quizId", quiz.id);
	return quiz;
}
