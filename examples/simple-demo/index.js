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
      // console.error(e)
      addClass(document.getElementById('authAgain'), 'hidden')
      message(e.message)
    })
}

async function authenticate (cui = false) {
  const username = document.getElementById('username').value
  const authentication = new trusona.WebAuthnAuthentication()
  document.getElementById('credentials').replaceChildren([])

  if (!cui) {
    resetSignals()
  }

  authentication
    .authenticate(controller.signal, username, cui)
    .then((result) => {
      const jwt = result.accessToken
      showCredentialActivity(jwt)

      return JSON.parse(window.atob(result.idToken.split('.')[1])).sub
    })
    .then((token) => { message(`You have successfully signed in as <span class="font-semibold text-purple-500">${token}</span>.`) })
    .then((_) => { document.getElementById('authAgain').classList.remove('hidden') })
    .then((_) => { document.getElementById('username').value = '' })
    .then((_) => { resetSignals() })
    .then((_) => { authenticate(true) })
    .catch((e) => {
      // console.error(e)

      addClass(document.getElementById('authAgain'), 'hidden')

      if (!cui) {
        message(e.message)
      }
    })
}

async function jwtApi (username) {
  try {
    // *** DO NOT USE THIS JWT GENERATOR IN A PRODUCTION ENVIRONMENT ***
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
  controller.abort('reset')
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

async function showCredentialActivity (token) {
  const pkm = new trusona.DefaultPasskeyManagement(token)
  const activities = await pkm.latestPasskeyActivity()

  let html = '<div class="flex flex-col text-xs text-left px-2">'

  Object.entries(activities).forEach((entry) => {    
    const [key, value] = entry

    html += `<table class="table-auto my-4">
    <thead><tr><th>Passkey ID: ${key}</th></tr></thead>`
    html += '<tbody>'
    
    Object.entries(value).forEach((map) => {    
      const [_, data] = map

      html += `
        <tr>
        <td class="my-1">
        <div class="py-1">Activity Type: ${data['credentialActivityType']}</div>
        <div class="py-1">Browser: ${data['userAgent']}</div>
        <div class="py-1">IP Address: ${data['ipAddress']}</div>
        <div class="py-1">System OS: ${data['operatingSystem']}</div>
        <div class="py-1">Synced: ${data['credentialFlags']?.BACKUP_STATE ?? 'n/a'}</div>
        <div class="py-1">Sync Eligibility: ${data['credentialFlags']?.BACKUP_ELIGIBILITY ?? 'n/a'}</div>
        <div class="py-1">When? ${moment(data['createdAt']).format('llll')}</div>
        </td>
        </tr>
        <tr><td class="py-1"><hr /></td></tr>
      `
    })

    html += '</tbody></table>'
  })

  const container = $('#credentials')
  
  while (container.firstChild) {
    container.firstChild.remove()
  }

  const notice = `
  <div class="px-2 text-xs text-gray-500">Below is a list of all passkeys that you have registered with this tenant, 
  when they were created, and the most recent assertion event for each.</div>`

  container.append(notice)
  container.append(html)
}
