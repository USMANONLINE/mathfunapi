const modules = {}

exports.initNumberGuess = function (server, api) {
  modules.api = api
  const basepath = '/api/'

  server.get(basepath + 'number-guess-health', numberGuessHealth)
  server.get(basepath + 'play-number-guess', getQuestion)
  server.post(basepath + 'guess', makeGuess)
}

function numberGuessHealth (req, res, next) {
  return res.json({
    status: 'ok',
    message: 'Number Guess service is up and running !'
  }).status(200)
}

async function getQuestion (req, res, next) {
  const number = parseInt(Math.random() * 100)
  const question = 'I have picked a number between 0 - 100 ? Can you guess it ?'

  const doc = {
    question,
    answer: number,
    meta: {
      stores: '_numberguess',
      date: new Date().toISOString()
    }
  }

  try {
    const resp = await modules.api.post(doc)
    return res.json({
      question,
      bookmark: resp.id
    }).status(200)
  } catch (error) {
    return res.json(error).status(400)
  }
}

async function makeGuess (req, res, next) {
  try {
    if (req.body === undefined || req.body === null || req.body.answer === undefined || req.body.bookmark === undefined) {
      return res.json({
        status: 'Error',
        message: 'Please format the request body and include valid bookmark and guess'
      })
    }

    const doc = await modules.api.get(req.body.bookmark)
    if (doc.error === 'not_found') {
      return res.json({
        status: 'Error',
        message: 'Invalid bookmark id'
      }).status(400)
    }

    let message = ''
    if (req.body.answer === doc.answer) {
      doc.answered = true
      const update = await modules.api.put(doc)
      return res.json({
        status: 'Success',
        message: 'You got it right'
      }).status(200)
    } else if (req.body.answer > doc.answer) {
      message = 'Your guess is higher than the number'
    } else if (req.body.answer < doc.answer) {
      message = 'Your guess is lower than the number'
    }

    return res.json({
      status: 'ok',
      message
    }).status(200)
  } catch (error) {
    return res.json(error).status(400)
  }
}
