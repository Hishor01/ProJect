const passwordInput = document.getElementById('password')
const togglePasswordBtn = document.getElementById('toggle-password')

let passwordVisible = false

togglePasswordBtn.addEventListener('click', () => {
    passwordVisible = !passwordVisible
    if(passwordVisible){
        passwordInput.type = 'text'
        togglePasswordBtn.textContent = 'Hide'
    }else{
        passwordInput.type = 'password'
        togglePasswordBtn.textContent = 'Show'
    }
})

const toast = (text, background, color, position = 'center') => {
    Toastify({
        text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position, // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background,
            color,
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

    let allUsers = []

    if(localStorage.getItem('users')){
        let retrievedUsers = JSON.parse(localStorage.getItem('users'))
        console.log(retrievedUsers)
        allUsers = retrievedUsers
    }else{
        allUsers = []
    }

    const signUp = () => {
        const firstName = document.getElementById("firstName").value.trim();
        const surName = document.getElementById("surName").value.trim();
        // const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        // const number = document.getElementById("number").value.trim();
    
        // Define regex patterns
        const nameRegex = /^[a-zA-Z]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        // const numberRegex = /^\d{11}$/;
    
        // Validate inputs
        if (!nameRegex.test(firstName)) {
            toast('Invalid First Name. Only letters are allowed.', '#f00', '#fff');
            return;
        }
        if (!nameRegex.test(surName)) {
            toast('Invalid Surname. Only letters are allowed.', '#f00', '#fff');
            return;
        }
        // if (!nameRegex.test(lastName)) {
        //     toast('Invalid Last Name. Only letters are allowed.', '#f00', '#fff');
        //     return;
        // }
        if (!emailRegex.test(email)) {
            toast('Invalid Email. Please enter a valid email address.', '#f00', '#fff');
            return;
        }
        if (!passwordRegex.test(password)) {
            toast('Invalid Password. Must be at least 8 characters, include Upper and lower,case and number.', '#f00', '#fff');
            return;
        }
        // if (!numberRegex.test(number)) {
        //     toast('Invalid Phone Number. Must be 11 digits.', '#f00', '#fff');
        //     return;
        // }

    
        // If all validations pass
        sub.innerHTML = '...loading'
        const userObj = { firstName, surName, email, password };
        allUsers.push(userObj);
        toast('Sign up successful😁', '#006400', '#fff')
            sub.innerHTML = '...loading'
            setTimeout(() => {
                sub.innerHTML = 'login.html'
            }, 2000)
        console.log(allUsers);
    
        // Clear input fields
        document.getElementById("firstName").value = '';
        document.getElementById("surName").value = '';
        // document.getElementById("lastName").value = '';
        document.getElementById("email").value = '';
        document.getElementById("password").value = '';
        // document.getElementById("number").value = '';
    
        // Save to localStorage
        // localStorage.setItem('usersSurName', surName)
        // localStorage.setItem('usersEmail',email)
        // localStorage.setItem('usersPassword', password)
        localStorage.setItem('usersData', JSON.stringify(userObj));
        window.localStorage.setItem('users', JSON.stringify(allUsers));
        setTimeout(() => {
            window.location.href = 'login.html';
        })
    };