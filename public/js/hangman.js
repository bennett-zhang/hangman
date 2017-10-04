"use strict"

const socket = io()
const $start = $("#start")
const $length = $("#length")
const $loading = $("#loading")
const $game = $("#game")
const $word = $("#word")
let $letters
const $eliminated = $("#eliminated")
const $instructions = $("#instructions")
const $guess = $("#guess")
let currentGuess
const $done = $("#done")
const animDur = 300

$start.submit(evt => {
	socket.emit("start", parseInt($length.val()))
	$loading.show(animDur)
	clear()
	return false
})

socket.on("start", length => {
	$loading.hide()
	$game.fadeIn(animDur)

	for (let i = 0; i < length; i++)
		$word.append(`<span class="letter"></span>`)

	$letters = $(".letter")
	$letters.click(evt => {
		const $target = $(evt.target)

		if (!$target.hasClass("fixed")) {
			if ($target.text()) {
				$target.empty()
			} else {
				$target.text(currentGuess)
			}
		}
	})
})

socket.on("err", msg => {
	alert(msg)
})

socket.on("guess", letter => {
	$guess.text(letter)
	currentGuess = letter
})

$done.click(evt => {
	let knownLetters = ""

	$letters.each((i, letter) => {
		const $letter = $(letter)
		const char = $letter.text()
		if (char) {
			knownLetters += char
			$letter.addClass("fixed")
		} else
			knownLetters += "*"
	})

	socket.emit("done", currentGuess, knownLetters)
})

socket.on("eliminate", eliminatedLetters => {
	$eliminated.text(eliminatedLetters)
})

socket.on("finish", clear)

function clear() {
	$game.hide()
	$word.empty()
	$eliminated.empty()
}
