function showMessage(input, message, type) {
    const msg = input.parentNode.querySelector("alert");
    msg.innerText = message;

    input.className = type ? "success" : "error";
    return type;
}

function showError(input, message) {
    return showMessage(input, message, false);
}

function showSuccess(input) {
    return showMessage(input, "", true);
}

function hasValue(input, message) {
    if(input.value.trim() === "") {
        return showError(input, message);
    }
    return showSuccess(input);
}

const form = document.querySelector("#login");

const USER_REQUIRED = "Enter the username or email";
const PW_REQUIRED = "Please enter the password";

form.addEventListener("submit", (event) => {

    let userValid = hasValue(form.elements["mail_username"], USER_REQUIRED);
    let pwValid = hasValue(form.elements["password"], PW_REQUIRED);

    if(userValid && pwValid) {
        form.submit();
        alert("Submitted to backend");
    }
    else {
        event.preventDefault();
    }
})