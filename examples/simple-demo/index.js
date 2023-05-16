let controller = new AbortController()

async function enroll (event) {
  const enrollment = new trusona.WebAuthnEnrollment()
  const jwt = document.getElementById('jwt').value

  resetSignals()

  enrollment
    .enroll(jwt, controller.signal)
    .then((_) => {
      message('You have successfully enrolled. Click on "Sign In".')
      nextAction(event, 'sign_in')
    })
    .catch((e) => {
      addClass(document.getElementById('authAgain'), 'hidden')
      message(e.message)
    })
}

async function authenticate (cui = false) {
  const username = document.getElementById('username').value
  const authentication = new trusona.WebAuthnAuthentication()

  if (!cui) {
    resetSignals()
  }

  authentication
    .authenticate(controller.signal, username, cui)
    .then((result) => {
      const jwt = result.accessToken
      showCredentials(jwt)

      return JSON.parse(window.atob(result.idToken.split('.')[1])).sub
    })
    .then((token) => { message(`You have successfully signed in as <span class="font-semibold text-purple-500">${token}</span>.`) })
    .then((_) => { document.getElementById('authAgain').classList.remove('hidden') })
    .then((_) => { document.getElementById('username').value = '' })
    .then((_) => { resetSignals() })
    .then((_) => { authenticate(true) })
    .catch((e) => {
      addClass(document.getElementById('authAgain'), 'hidden')

      if (!cui) {
        message(e.message)
      }
    })
}

async function jwtApi (username) {
  try {
    const response = await fetch(`https://jwks-delegate.lab.trusona.net/jwt?sub=${username}`)
    const data = await response.json()
    return await Promise.resolve(data.jwt)
  } catch (e) {
    return await Promise.reject(e)
  }
}

function message (msg) {
  document.getElementById('msg').innerHTML = msg
}

function resetSignals () {
  controller.abort()
  controller = new AbortController()
}

function keypress (event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    return false
  }
}

async function next (event) {
  const username = document.getElementById('username').value.trim()
  document.getElementById('msg').innerHTML = ''

  if (action(event) === 'submit') {
    if (username) {
      jwtApi(username)
        .then((jwt) => { document.getElementById('jwt').value = jwt })
        .then(() => { uxOnSubmit(username, event) })
        .catch((e) => { message(e.message) })
    } else {
      message('Was a username specified?')
    }
  } else if (action(event) === 'reset') {
    window.location.href = './index.html'
  } else if (action(event) === 'enroll') {
    enroll(event)
  } else if (action(event) === 'sign_in') {
    addClass(document.getElementById('authAgain'), 'hidden')
    authenticate(false)
  }

  event.preventDefault()
}

function addClass (element, className) {
  if (element && !element.classList.contains(className)) {
    element.classList.add('hidden')
  }
}

function action (event) {
  return event.target.getAttribute('data-next') ?? undefined
}

function actionToText (action) {
  if (action === 'enroll') {
    return 'Enroll'
  } else if (action === 'sign_in') {
    return 'Sign In'
  }
}

function uxOnSubmit (username, event) {
  document.getElementById('username').value = username
  document.getElementById('username').setAttribute('disabled', 'true')
  message('Next, click on "Enroll", and follow the prompts.')
  nextAction(event, 'enroll')
}

function nextAction (event, action) {
  event.target.setAttribute('data-next', action)
  event.target.innerHTML = actionToText(action)
  event.target.textContext = actionToText(action)
  event.target.innerText = actionToText(action)
}

async function showCredentials (token) {
  const pkm = new trusona.DefaultPassKeyManagement(token)
  const passkeys = await pkm.get(token)

  const ux = Object.keys(passkeys[0]).indexOf('userIdentifier')
  const px = Object.keys(passkeys[0]).indexOf('publicKey')
  const cx = Object.keys(passkeys[0]).indexOf('created')

  const container = $('#credentials')
  const table = $('<table class="table table-fixed">')
  const columns = Object.keys(passkeys[0])
  const thead = $('<thead>')
  const tr = $('<tr>')

  $.each(columns, function (i, item) {
    if (i !== ux && i !== px) {
      const th = $('<th class="px-4">')
      th.text(item)
      tr.append(th)
    }
  })

  thead.append(tr)
  table.append(tr)

  $.each(passkeys, function (i, item) {
    const tr = $('<tr class="px-2">')
    const values = Object.values(item)

    $.each(values, (i, element) => {
      if (i !== ux && i !== px) {
        const td = $('<td class="px-4">')

        if (i === cx) {
          td.append('<pre>' + moment(element).format('llll') + '</pre>')
        } else {
          td.append('<pre>' + element + '</pre>')
        }
        tr.append(td)
      }
    })
    table.append(tr)
  })

  const notice = '<div class="p-4">Below is a list of all passkeys (their identifiers in our system) that you have and when they were created.</div>'

  container.append(notice)
  container.append(table)
}
