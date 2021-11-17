const modules = {}

exports.initBaseConversion = function (server, api) {
  modules.api = api
  const basepath = '/api/'

  server.get(basepath + 'base-conversion-health', baseConversionHealth)
  server.get(basepath + 'play-conversion', getQuestion)
  server.post(basepath + 'base-answer', getAnswer)
}

function baseConversionHealth (req, res, next) {  
  return res.json({
    status: 'ok',
    message: 'Base Conversion Service is up and running !'
  }).status(200)
}

async function getQuestion (req, res, next) {
  try {
    const options = [2, 16]
    const op = options[parseInt(Math.random() * options.length)]

    const randomNumber = parseInt(Math.random() * 1500)
    const repr = Number(randomNumber).toString(op)

    const doc = {
      question: 'Convert ' + repr + ' from base ' + op +  ' to base 10',
      answer: randomNumber,
      meta: {
        stores: '_arithmetics',
        date: new Date().toISOString()
      }
    }

    const record = await modules.api.post(doc)

    return res.json({
      question: 'Convert ' + repr + ' from base ' + op +  ' to base 10',
      bookmark: record.id
    }).status(200)
  } catch (error) {
    return res.json(error).status(400)
  }
}

async function getAnswer (req, res, next) {
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
