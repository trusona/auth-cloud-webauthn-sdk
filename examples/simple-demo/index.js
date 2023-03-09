
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
      getJwt(username)

      document.getElementById('username').setAttribute('disabled', 'true')

      message('Next, click on "Enroll", and follow the prompts.')
      nextAction(event, 'enroll')
    } else {
      message('Was a username specified?')
    }
  } else if (action(event) === 'reset') {
    window.location.href = './index.html?z=' + Math.random()
    return true
  } else if (action(event) === 'enroll') {
    enroll(event)
  } else if (action(event) === 'sign_in') {
    addClass(document.getElementById('authAgain'), 'hidden')
    authenticate()
  }

  event.preventDefault()
  return false
}

function addClass(element, className) {
  if(element && !element.classList.contains(className)) {
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

function nextAction (event, action) {
  event.target.setAttribute('data-next', action)
  event.target.innerHTML = actionToText(action)
  event.target.textContext = actionToText(action)
  event.target.innerText = actionToText(action)
}

function message (msg) {
  document.getElementById('msg').innerHTML = msg
}

function enroll (event) {
  const enrollment = new trusona.WebAuthnEnrollment()
  const jwt = document.getElementById('jwt').value
  enrollment
    .enroll(jwt, new AbortController().signal)
    .then((_) => {
      message('You have successfully enrolled. Click on "Sign In".')
      nextAction(event, 'sign_in')
    })
    .catch((e) => message(e.message))
}

function subject (token) {
  return (JSON.parse(window.atob(token.split('.')[1]))).sub
}

function authenticate (cui = false) {
  const username = document.getElementById('username').value
  const authentication = new trusona.WebAuthnAuthentication()

  authentication
    .authenticate(cui, username, new AbortController().signal)
    .then((result) => {
      message(`You have successfully signed in as <span class="font-semibold text-purple-500">${subject(result.token)}</span>.`)
      document.getElementById('authAgain').classList.remove('hidden')
    })
    .catch((e) => message(e.message))
}

function getJwt (username) {
  fetch(`https://shopify-demo-connector.herokuapp.com/jwt?sub=${username}`)
    .then((r) => r.json())
    .then((data) => {
      document.getElementById('username').value = username
      document.getElementById('username').setAttribute('disabled', 'true')
      document.getElementById('jwt').value = data.jwt
    })
    .catch((e) => message(e.message))
}
