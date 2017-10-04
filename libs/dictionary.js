"use strict"

const fs = require("fs")
const {
	Word
} = require("./word")
const path = "libs/words.txt"

let callback
module.exports = cb => {
	callback = cb
}

class FileError extends Error {
	constructor(path) {
		super(`File ${path} doesn't exist.`)
	}
}

fs.exists(path, exists => {
	if (exists) {
		fs.readFile(path, "utf8", (err, data) => {
			const dictionary = data.split("\n")
			dictionary.map(word => Word(word))
			callback(dictionary)
		})
	} else
		console.log(new FileError(path))
})
