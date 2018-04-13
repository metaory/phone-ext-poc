const inquirer = require('inquirer')
const response = require('./operators.res')

const MIN_NUMBER_LEN = 5

  !(function prompt() {
    inquirer
      .prompt([{
        type: 'input',
        name: 'number',
        validate: (value, result) => isNaN(value) ? 'NOT_A_NUMBER' : !result.operator ? 'NO_OPERATOR_MATCHED' : value.length < MIN_NUMBER_LEN ? `NUMBER_LENGTH : number must be more than ${MIN_NUMBER_LEN} digits` : true,
        message: 'enter phone number',
        transformer: (value, result) => {
          if (!value) return value
          process.stdout.write('\033c')
          result.operator = search(value)
          console.log('::', isNaN(value) ? 'NOT_A_NUMBER' : result.operator ? result.operator.operatorName : '-')
          return value
        }
      }])
      .then(result => {
        console.log(JSON.stringify(result, null, 2))
        prompt()
      })
  })()


/**
 * Find Operator
 * @param {string} input
 * @return {object}
 * */
function search(input) {
  input = input.replace(/^0/, '')
  let operatorId = null
  let subset = response.dictionary

  for (const char of input) {
    subset = subset[char] || false
    if (!subset) operatorId = null
    if (typeof subset === 'string') {
      operatorId = subset
      break
    }
  }

  if (typeof response.dictionary[input] === 'string') {
    operatorId = response.dictionary[input]
  }

  const operator = response.operatorList.find(x => x.operatorId == operatorId) || null

  console.log(JSON.stringify({ input, next_digit: operator ? '*' : Object.keys(subset), result: operator }, null, 2))

  return operator
}
