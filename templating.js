function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function generate(template, model) {
  let result = template;

  for (const val in model) {
    result = replaceAll(result, val, model[val]);
  }

  return result;
}

module.exports = generate;
