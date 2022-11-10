console.log(`homepage client script successfully loaded.`);

const format_date_time = (date) => {
  // Format date as mmmm dd, yyyy hh:mm {am/pm}
  let EventDate = new Date(date);
  return `${new Intl.DateTimeFormat(`en-US`, { month: 'long' }).format(EventDate)} ${EventDate.getDate()}, ${EventDate.getFullYear()} ${EventDate.toLocaleTimeString(`en-US`, {
    hour: '2-digit',
    minute: '2-digit'
  })}`
};

const submitCommentToServer = async (commentData) => {
  try {
    let response = await fetch(`/api/comment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentData)
    });

    return response;

  } catch (err) {
    document.location.replace(`/error`)
  }
};

const appendCommentToPage = (newComment) => {
  const relevantBlogPostForm = document.getElementById(`comment-form-${newComment.post_id}`);
  let newCommentHTML = `
  <div class="container">
    <div class="row">
      <div class="card my-3">
        <small class="text-muted">On ${format_date_time(newComment.createdAt)}, you said:
        </small>
        <p>${newComment.comment_body}</p>
      </div>
    </div>
  </div>
  `;

  relevantBlogPostForm.insertAdjacentHTML('afterend', newCommentHTML);
}

const handleCommentSubmit = async (e) => {
  e.preventDefault();
  // console.log(`handleCommentSubmit FIRED`);
  let post_id = e.target.id;
  let comment_body = document.getElementById(`new-comment-body-${post_id}`).value;

  document.getElementById(`new-comment-body-${post_id}`).value = '';

  let commentData = {
    post_id,
    comment_body,
  }

  let newComment = await submitCommentToServer(commentData)
    .then(comment => comment.json())
    .then(comment => comment);


  appendCommentToPage(newComment);
};

const populateCommentEditModal = (e) => {
  // console.log(`populateCommentEditModal FIRED`);
  // capture relevant content
  const comment_id = e.target.id;
  const comment_body = document.getElementById(`comment-body-${comment_id}`);

  // capture relevant fields in edit modal
  const commentEditFieldEl = document.getElementById(`comment_body_edit`);
  const commentIdReferenceField = document.getElementById(`comment_id_reference`);

  // populate relevant fields in edit modal
  commentEditFieldEl.textContent = comment_body.textContent;
  commentIdReferenceField.value = comment_id;

};

const submitCommentEdit = async () => {
  // console.log(`submitCommentEdit FIRED`)
  const comment_body = document.getElementById(`comment_body_edit`).value;
  const comment_id = document.getElementById(`comment_id_reference`).value;

  const commentEditData = {
    id: comment_id,
    comment_body,
  }

  // console.log(commentEditData);

  try {
    let response = await fetch(`/api/comment/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentEditData)
    });

    if (response.ok) {
      document.location.reload();
      return;
    }
    document.location.replace(`/error`)

  } catch (err) {
    document.location.replace(`/error`)
  }
};



const addCommentButtonEventListeners = () => {
  // console.log(`addCommentButtonEventListeners FIRED`)
  const commentSubmitButtons = document.getElementsByClassName(`submit-comment`);

  for (let i = 0; i < commentSubmitButtons.length; i++) {
    commentSubmitButtons[i].addEventListener(`click`, handleCommentSubmit);
  }
  // console.log(`Event listeners added to comment submit buttons.`)
};

const addEditCommentButtonEventListeners = () => {
  // console.log(`addEditCommentButtonEventListeners FIRED`);
  const editCommentButtons = document.getElementsByClassName(`edit`);
  for (let i = 0; i < editCommentButtons.length; i++) {
    editCommentButtons[i].addEventListener(`click`, populateCommentEditModal);
  }
}

const addSubmitCommentEditButtonEventListener = () => {
  // console.log(`addSubmitCommentEditButtonEventListeners FIRED`)
  const submitCommentEditButton = document.getElementById(`submit_comment_edit`);

  submitCommentEditButton.addEventListener(`click`, submitCommentEdit)

  // console.log(`Event listeners added to comment edit buttons.`)
};


// BEGIN DELETE COMMENT BUTTON LOGIC
let selectedComment;

const submitCommentDelete = async () => {
  // console.log(`submitCommentDelete FIRED`);
  // console.log(`SELECTED COMMENT ID IS ${selectedComment}`);

  try {
    let response = await fetch(`/api/comment/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: selectedComment })
    });

    if (response.ok) {
      document.location.reload();
      return;
    }
    document.location.replace(`/error`)

  } catch (err) {
    document.location.replace(`/error`)
  }




};

const updateSelectedComment = (e) => {
  // console.log(`updateSelectedComment FIRED`);
  selectedComment = e.target.id;
}

const addDeleteCommentButtonEventListeners = () => {
  // console.log(`addSubmitCommentDeleteButtonEventListeners FIRED`)
  const commentDeleteButtons = document.getElementsByClassName(`delete`);

  for (let i = 0; i < commentDeleteButtons.length; i++) {
    commentDeleteButtons[i].addEventListener(`click`, updateSelectedComment);
  }
  // console.log(`Event listeners added to comment delete buttons.`)
};

const addSubmitDeleteCommentButtonEventListener = (e) => {
  console.log(`addDeleteCommentButtonEventListener FIRED`);
  e.preventDefault();
  document.getElementById(`submit-comment-delete`).addEventListener(`click`, submitCommentDelete)
};


document.addEventListener(`DOMContentLoaded`, addCommentButtonEventListeners);

document.addEventListener(`DOMContentLoaded`, addEditCommentButtonEventListeners);

document.addEventListener(`DOMContentLoaded`, addDeleteCommentButtonEventListeners);

document.addEventListener(`DOMContentLoaded`, addSubmitCommentEditButtonEventListener);

document.addEventListener(`DOMContentLoaded`, addSubmitDeleteCommentButtonEventListener);