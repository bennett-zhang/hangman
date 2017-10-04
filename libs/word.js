"use strict"

class WordError extends Error {
	constructor(str) {
		super(`${str} isn't a valid word.`)
	}
}

function Word(str) {
	str = str.trim().toUpperCase()

	if (/[^A-Z]/.test(str))
		console.log(new WordError(str))

	return str
}

class LetterError extends Error {
	constructor(str) {
		super(`${str} isn't a valid letter.`)
	}
}

function Letter(str) {
	str = Word(str)

	if (str.length !== 1)
		console.log(new LetterError(str))

	return str
}

module.exports = {
	Word,
	Letter
}
