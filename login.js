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

document.addEventListener('keydown', (e) =>{
    if(KeyboardEvent.keyCode === 13){
        document.submit() 
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

const allUsers =  []



const logIn = () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Retrieve stored credentials
    const storedUserObj = JSON.parse(localStorage.getItem('usersData'));
    //const storedPassword = localStorage.getItem('usersPassword');

    // Validate login credentials
    if (email === '' && password === ''){
        toast('Input valid email & password please')
        return;
    }
    //else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
       // toast('Input your valid email')
        //return;
    //}
    else if (password === ''){
        toast('Input your valid password')
        toggleBtn.textContent = 'hide'


        return;
    }
    if (storedUserObj && storedUserObj.email !== email){
        toast('Email not found, please sign up first', '#f00', '#fff')
        return;
    }
    
    else if (storedUserObj && storedUserObj.password !== password){
        toast('Invalid password, please enter valid password', '#f00', '#fff')
        return;
    }
        
        
        // else{
        // document.getElementById("email").value.trim()
        //     document.getElementById("password").value.trim()
            
            
        else if (storedUserObj){
            
            
            allUsers.push(storedUserObj && storedUserObj === email && storedUserObj && storedUserObj === password)
            console.log(storedUserObj);
            
            toast('Log in successful😁', '#006400', '#fff')
            sub.innerHTML = '...loading'
            setTimeout(() => {
                sub.innerHTML = 'dashboard.html'
            }, 1000)
            localStorage.setItem("loggedIn", "true"); 
            
            console.log(allUsers);
            
            document.getElementById("email").value = '';
            document.getElementById("password").value = '';
            setTimeout(() => {
                window.location.href = 'dashboard.html'    
            }, 2000)
}
}
