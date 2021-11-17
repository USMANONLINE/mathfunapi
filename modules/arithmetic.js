const modules = {}

exports.initArithmetics = function (server, api) {
  modules.api = api
  const basepath = '/api/'

  server.get(basepath + 'arithmetic-health', arithmeticHealth)
  server.get(basepath + 'play-arithmetics', getQuestion)
  server.post(basepath + 'answer', answerQuestion)
}

function arithmeticHealth (req, res, next) {
  return res.json({
    status: 'ok',
    message: 'Arithmetic Service is up and running !'
  }).status(200)
}

async function getQuestion (req, res, next) {
  const operations = ['+', '-', 'x']
  let num1 = parseInt(Math.random() * 200)
  const num2 = parseInt(Math.random() * 100)

  const op = operations[parseInt(Math.random() * operations.length)]
  let results = 0

  switch (op) {
    case "+": {
      results = num1 + num2
      break
    }
    case "-": {
      if (num2 > num1) {
        num1 += (num2 + (parseInt(Math.random() * 20)))
      }
      results = num1 - num2
      break
    }
    case "x": {
      results = num1 * num2
      break
    }
  }

  const doc = {
    question: 'What is ' + num1 + ' ' + op + ' ' + num2 + ' ?',
    answer: results,
    meta: {
      stores: '_arithmetics',
      date: new Date().toISOString()
    }
  }

  try {
    const record = await modules.api.post(doc)
    return res.json({
      question: doc.question,
      bookmark: record.id
    }).status(200)
  } catch (error) {
    return res.json(error).status(400)
  }
}

async function answerQuestion (req, res, next) {
  try {
    if (req.body === undefined || req.body === null || req.body.answer === undefined || req.body.bookmark === undefined) {
      return res.json({
        status: 'Error',
        message: 'Please format the request body and include valid bookmark and answer'
      })
    }

    const doc = await modules.api.get(req.body.bookmark)
    if (req.body.answer === doc.answer) {
      doc.answered = true
      const update = await modules.api.put(doc)
      return res.json({
        status: 'Success',
        message: 'You got it right'
      }).status(200)
    } else {
      return res.json({
        status: 'ok',
        message: 'Incorrect answer, Please try again !'
      }).status(200)
    }

  } catch (error) {
    return res.json(error).status(400)
  }
}


