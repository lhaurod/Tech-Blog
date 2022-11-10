console.log(`login client script successfully loaded.`)

const handleFormSubmit = async (e) => {
  e.preventDefault();
  let user_name = document.querySelector(`#user_name`).value;
  let password = document.querySelector(`#password`).value;

  let loginData = { user_name, password }

  

  const response = await fetch(`/api/user/login`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })


  // Begin logic to reveal invalid login message if attempt is rejected.
  let invalidMsgEl = document.querySelector(`#errorMsg`);

  const timeout = (fn, ms) => {
    return new Promise(resolve => setTimeout(() => {
      fn();
      resolve();
    }, ms));
  };

  const hideErrorMsg = () => {
    invalidMsgEl.classList.add("d-hidden")
  };

  const revealErrorMsg = async (invalidMsgEl) => {
    invalidMsgEl.classList.remove("d-hidden")
    await timeout(hideErrorMsg, 7000)
  };

  if (response.status >= 400) {
    
    revealErrorMsg(invalidMsgEl);
  } else {
    document.location.replace('/dashboard');
  }
}

const loginButton = document.querySelector(`#login`)

loginButton.addEventListener(`click`, handleFormSubmit);