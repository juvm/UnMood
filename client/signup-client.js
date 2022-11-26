


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

function validateEmail(input, requiredMsg, invalidMsg) {
    if(!hasValue(input, requiredMsg)) {
        return false;
    }

    const emailRegex = 
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const email = input.value.trim();

    if(!emailRegex.test(email)) {
        return showError(input, invalidMsg);
    }

    return true;
}

function validateCPW(pw, cpw, requiredMsg, invalidMsg) {
    if(!hasValue(cpw, requiredMsg)) {
        return false;
    }

    const trim_pw = pw.value.trim();
    const trim_cpw = cpw.value.trim();

    if(trim_pw !== trim_cpw) {
        return showError(cpw, invalidMsg);
    }

    return true;
}

//trimming the data before validating is extremely important, all comparisons
//and validations fail if the values are not trimmed

const form = document.querySelector("#signup");

const NAME_REQUIRED = "Please enter your name";
const EMAIL_REQUIRED = "Please enter your email";
const PW_REQUIRED = "Please enter your password";
const CPW_REQUIRED = "Please re-enter your password";

const EMAIL_INVALID = "Please enter a correct email address format";
const CPW_INVALID = "The passwords do not match";

form.addEventListener("submit", (event) => {

    let nameValid = hasValue(form.elements["username"], NAME_REQUIRED);
    let emailValid = validateEmail(form.elements["email"], EMAIL_REQUIRED, EMAIL_INVALID);
    let pwValid = hasValue(form.elements["password"], PW_REQUIRED);
    let cPwValid = validateCPW(form.elements["password"], form.elements["confirmpassword"], CPW_REQUIRED, CPW_INVALID);

    if(nameValid && emailValid && pwValid && cPwValid) {
        form.submit();
        alert("submitted!");
    }
    else {  
        event.preventDefault();
    }
});