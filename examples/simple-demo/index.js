
function enroll (event) {
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

function authenticate (cui = false) {
  const username = document.getElementById('username').value
  const authentication = new trusona.WebAuthnAuthentication()

  if (!cui) {
    resetSignals()
  }

  authentication
    .authenticate(cui, username, controller.signal)
    .then((result) => JSON.parse(window.atob(result.token.split('.')[1])).sub)
    .then((token) => { message(`You have successfully signed in as <span class="font-semibold text-purple-500">${token}</span>.`) })
    .then((_) => { document.getElementById('authAgain').classList.remove('hidden') })
    .catch((e) => {
      addClass(document.getElementById('authAgain'), 'hidden')

      if (!cui) {
        message(e.message)
      }
    })
}

async function jwtApi (username) {
  try {
    const r = await fetch(`https://shopify-demo-connector.herokuapp.com/jwt?sub=${username}`)
    const data = await r.json()
    return await Promise.resolve(data.jwt)
  } catch (e) {
    return await Promise.reject(e)
  }
}
let controller = new AbortController()

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

function next (event) {
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
  return false
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
