// ===============================
// TASK 4 - DYNAMIC INTERACTION
// ===============================


// Show password strength
function checkPasswordStrength() {

    const password =
        document.getElementById("password").value;

    const strength =
        document.getElementById("passwordStrength");


    if (password.length === 0) {

        strength.textContent = "";

        return;
    }


    if (password.length < 6) {

        strength.textContent =
            "Password Strength: Weak";

    } else if (
        password.length >= 6 &&
        password.length < 10
    ) {

        strength.textContent =
            "Password Strength: Medium";

    } else {

        strength.textContent =
            "Password Strength: Strong";
    }
}


// Complex form validation
function validateForm() {

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const age =
        document.getElementById("age").value;

    const password =
        document.getElementById("password").value;


    // Name validation
    if (name === "") {

        alert("Please enter your name.");

        return false;
    }


    if (name.length < 3) {

        alert("Name must contain at least 3 characters.");

        return false;
    }


    // Email validation
    if (email === "") {

        alert("Please enter your email.");

        return false;
    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");

        return false;
    }


    // Age validation
    if (age === "") {

        alert("Please enter your age.");

        return false;
    }


    if (age < 18 || age > 100) {

        alert("Age must be between 18 and 100.");

        return false;
    }


    // Password validation
    if (password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return false;
    }


    return true;
}


// Dynamic student counter
function updateStudentCount() {

    const students =
        document.querySelectorAll(".student-card");

    const count =
        document.getElementById("studentCount");


    if (count) {

        count.textContent =
            students.length;
    }
}


// Run when page loads
document.addEventListener("DOMContentLoaded", function () {

    updateStudentCount();

});