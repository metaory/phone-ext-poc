const inquirer = require('inquirer')
const chalk = require('chalk')
const response = require('./operators.res')
const { log } = console

const MIN_NUMBER_LEN = 4

  !(function prompt() {
    inquirer
      .prompt([{
        type: 'input',
        name: 'number',
        validate: (value, result) => isNaN(value) ? 'NaN' : value.length < MIN_NUMBER_LEN ? `LENGTH < ${MIN_NUMBER_LEN}` : !result.operator.operatorId ? 'NO_MATCH' : true,
        message: 'enter phone number',
        transformer: (value, result) => {
          const { operatorName, operatorId } = result.operator = search(value)
          isNaN(value) && log('\n' + chalk.red('NaN'))
          log(chalk[operatorId ? 'green' : 'red'](operatorName || value && 'NO_MATCH' || ''))
          return value
        }
      }])
      .then(prompt)
  })()

/**
 * Find Operator
 * @param {string} input
 * @return {object}
 * */
function search(input) {
  if (isNaN(input)) return {}

  const number = input.replace(/^0/, '')
  let operatorId = null
  let subset = response.dictionary

  for (const digit of number) {
    subset = subset[digit] || false
    if (!subset) operatorId = null
    if (typeof subset === 'string') {
      operatorId = subset
      break
    }
  }

  if (typeof response.dictionary[number] === 'string') {
    operatorId = response.dictionary[number]
  }

  const operator = response.operatorList.find(x => x.operatorId == operatorId) || {}

  log(chalk.gray('\n---------------------------------------------------------'))
  log(JSON.stringify({ number, possible_next: operatorId ? '*' : Object.keys(subset), operator }, null, 2))

  return operator
}
