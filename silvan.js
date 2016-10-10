'use strict'

const _ = require('lodash')

var ONE_TO_NINETEEN = [
  "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen"
];

var TENS = [
  "ten", "twenty", "thirty", "forty", "fifty",
  "sixty", "seventy", "eighty", "ninety"
];

var SCALES = ["thousand", "million", "billion", "trillion"];

// helper function for use with Array.filter
function isTruthy(item) {
  return !!item;
}

// convert a number into "chunks" of 0-999
function chunk(number) {
  var thousands = [];

  while(number > 0) {
    thousands.push(number % 1000);
    number = Math.floor(number / 1000);
  }

  return thousands;
}

// translate a number from 1-999 into English
function inEnglish(number) {
  var thousands, hundreds, tens, ones, words = [];

  if(number < 20) {
    return ONE_TO_NINETEEN[number - 1]; // may be undefined
  }

  if(number < 100) {
    ones = number % 10;
    tens = number / 10 | 0; // equivalent to Math.floor(number / 10)

    words.push(TENS[tens - 1]);
    words.push(inEnglish(ones));

    return words.filter(isTruthy);
  }

  hundreds = number / 100 | 0;
  words.push(inEnglish(hundreds));
  words.push("hundred");
  words.push(inEnglish(number % 100));

  return words.filter(isTruthy);
}

// append the word for a scale. Made for use with Array.map
function appendScale(chunk, exp) {
  var scale;
  if(!chunk) {
    return null;
  }
  scale = SCALES[exp - 1];
  return [chunk, scale].filter(isTruthy);
}

const magicify = (n) => {
  if (!n) return 'zero';

  var chunks = chunk(n)
          .map(inEnglish)
          .map(appendScale)
          .filter(isTruthy)
          .reverse()

  return _.flatMapDeep(chunks).join('_')
}

function compile() {
  for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    var magicNumber = ['const', magicify(i).toUpperCase(), '=', i].join(' ');
    console.log(magicNumber)
  }
}

compile()
