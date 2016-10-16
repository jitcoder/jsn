function fillString(character, size) {
  let result = '';

  for (let i = 0; i < size; i += 1) {
    result += character;
  }

  return result;
}

function print(message, tabsize) {
  console.log(`${fillString(' ', tabsize)}${message}`);
}

module.exports = { fillString, print };
