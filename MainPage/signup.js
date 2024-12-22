function checkInfo(){
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;

    if (email === "claudioxavier@ua.pt") {
        if (password === "claudiozito01") {
            alert("Login efetuado com sucesso!");
            window.location.href = "areapessoal.html";
            let personalData = JSON.parse(localStorage.getItem("personalData")) || {};
            personalData.email = email;
            personalData.password = password;
            personalData.name = 'Claudio Xavier';
            personalData.nmec = '126001';
            personalData.ntelemovel = '933678952';
            localStorage.setItem("personalData", JSON.stringify(personalData));
        }
        else {
            alert("Password incorreta!");
        }
    }
    else {
        alert("Email incorreto!");
    }
};