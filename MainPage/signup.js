function checkInfo(){
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;

    if (email === "claudioxavier@ua.pt") {
        if (password === "claudiozito01") {
            alert("Login efetuado com sucesso!");
            window.location.href = "areapessoal.html";
        }
        else {
            alert("Password incorreta!");
        }
    }
    else {
        alert("Email incorreto!");
    }

};