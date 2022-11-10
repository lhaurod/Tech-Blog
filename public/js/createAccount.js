console.log(`createAccount client script successfully loaded.`)

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

const revealErrorMsg = async (invalidMsgEl, message) => {
  invalidMsgEl.textContent = message;
  invalidMsgEl.classList.remove("d-hidden")
  await timeout(hideErrorMsg, 10000)
};



const handleFormSubmit = async (e) => {
  e.preventDefault();
  let user_name = document.querySelector(`#user_name`).value;
  let password = document.querySelector(`#password`).value;

  if (password.length < 8) {
    console.log(`Password must be at least 8 characters.`);
    revealErrorMsg(invalidMsgEl, `Password must be at least 8 characters long.`);
    return;
  }
  let accountData = { user_name, password }



  const response = await fetch(`/api/user/createaccount`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(accountData)
  })


  if (response.status === 409) {
    console.log(`username already taken`);
    revealErrorMsg(invalidMsgEl, `Username "${user_name}" is already taken.`);
    return;
  } else if (response.status === 500) {
    console.log(`Server Error`);
    revealErrorMsg(invalidMsgEl, `The Server encountered an error. Please contact support.`);
    return
  }
  if (response.status === 201) {
    document.location.replace('/dashboard');
    return;
  }
}


const loginButton = document.querySelector(`#create-account`)

loginButton.addEventListener(`click`, handleFormSubmit);
