"use strict"

const {
	Word,
	Letter
} = require("./word")
require("./dictionary")(onload)

let io
let guesses
let knownLetters
let dictionary
let possibleWords

module.exports = arg => {
	io = arg
}

function onload(dict) {
	dictionary = dict

	io.on("connection", socket => {
		socket.on("start", length => start(socket, length))

		socket.on("done", (currentGuess, letters) => {
			if (knownLetters === letters)
				socket.emit("eliminate", currentGuess)

			knownLetters = letters

			filterPossibleWords()
			if (!possibleWords.length) {
				socket.emit("err", "No such word exists.")
				socket.emit("finish")
				return
			}

			if (knownLetters.includes("*"))
				bestGuess(socket)
			else
				socket.emit("finish")
		})
	})
}

function start(socket, length) {
	guesses = ""
	possibleWords = dictionary

	if (Number.isInteger(length) && length >= 2 && length <= 15) {
		knownLetters = "*".repeat(length)
		bestGuess(socket)
		socket.emit("start", length)
	} else {
		socket.emit("err", "Length must be an integer between 2 and 15.")
	}
}

function bestGuess(socket) {
	const aCharCode = "a".charCodeAt()
	const zCharCode = "z".charCodeAt()
	const charAppearances = Array(zCharCode + 1).fill(0)

	possibleWords.forEach(word => {
		for (let i = aCharCode; i <= zCharCode; i++) {
			const letter = Letter(String.fromCharCode(i))

			if (!guesses.includes(letter) && word.includes(letter))
				charAppearances[i]++
		}
	})

	const bestCharCode = charAppearances.reduce((iMax, appearances, i) => {
		if (appearances > charAppearances[iMax])
			return i
		return iMax
	}, 0)

	guess(socket, String.fromCharCode(bestCharCode))
}

function guess(socket, str) {
	const letter = Letter(str)

	if (guesses.includes(letter))
		return

	guesses += letter

	socket.emit("guess", letter)
}

function filterPossibleWords() {
	const combined = knownLetters.replace(/\*/g, `[^${guesses}]`)
	const regExp = new RegExp(`^${combined}$`)
	possibleWords = possibleWords.filter(word => regExp.test(word))
}

function replaceChar(str, i, char) {
	return str.slice(0, i) + char + str.slice(i + 1)
}
