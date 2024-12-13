window.addEventListener('DOMContentLoaded', (event) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        // Se o token de acesso estiver presente no localStorage, buscar dados do Google Fit
        fetchFitnessData(accessToken);
    } else {
        // Se o token de acesso não estiver presente, iniciar o processo de login
        iniciarLoginGoogle();
    }
});

function iniciarLoginGoogle() {
    fetch('client_secret_182308303226-9ma1qn7f10b7irrfajak3p4lv5op5tal.apps.googleusercontent.com.json')
        .then(response => response.json())
        .then(data => {
            const clientId = data.web.client_id;
            const redirectUri = window.location.origin + window.location.pathname; // Use a URI de redirecionamento atual

            // Redirecionar o usuário para obter o código de autorização
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=https://www.googleapis.com/auth/fitness.activity.read`;
            window.location.href = authUrl;
        })
        .catch(error => console.error('Erro ao carregar o ficheiro de client secret:', error));
}

// Ao redirecionar de volta, resgate o código de autorização da URL e obtenha o token de acesso
const urlParams = new URLSearchParams(window.location.search);
const authorizationCode = urlParams.get('code');

if (authorizationCode) {
    fetch('client_secret_182308303226-9ma1qn7f10b7irrfajak3p4lv5op5tal.apps.googleusercontent.com.json')
        .then(response => response.json())
        .then(data => {
            const clientId = data.web.client_id;
            const clientSecret = data.web.client_secret;
            const redirectUri = window.location.origin + window.location.pathname; // Use a URI de redirecionamento atual

            fetchAccessToken(authorizationCode, clientId, clientSecret, redirectUri);
        })
        .catch(error => console.error('Erro ao carregar o ficheiro de client secret:', error));
}

// Função para obter o token de acesso
function fetchAccessToken(authorizationCode, clientId, clientSecret, redirectUri) {
    const backendUrl = "https://oauth2.googleapis.com/token";
    const grantType = "authorization_code";

    fetch(backendUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: authorizationCode,
            redirect_uri: redirectUri,
            grant_type: grantType
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Resposta do token:", data);
            if (data.access_token) {
                // Salvar o access token no localStorage e redirecionar para a mesma página
                localStorage.setItem('accessToken', data.access_token);
                window.location.href = window.location.origin + window.location.pathname; // Redirecionar para a mesma página
            } else {
                console.error("Erro ao obter o token de acesso:", data);
            }
        })
        .catch(error => console.error("Erro ao obter token de acesso:", error));
}

// Função para buscar dados de atividades do Google Fit
function fetchFitnessData(accessToken) {
    const url = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";

    const requestBody = {
        aggregateBy: [{
            dataTypeName: "com.google.step_count.delta" // Tipo de dados para contar passos
        }],
        bucketByTime: { durationMillis: 86400000 }, // Período de 1 dia (em milissegundos)
        startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // Últimos 7 dias
        endTimeMillis: Date.now(),
    };

    fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Dados do Google Fit:", data);
            displayFitnessData(data);
        })
        .catch(error => console.error("Erro ao buscar dados do Google Fit:", error));
}

// Função para exibir os dados de atividade do Google Fit na página
function displayFitnessData(data) {
    const fitDataDiv = document.getElementById("fit-data");
    fitDataDiv.innerHTML = `<h2>Dados de Atividade do Google Fit</h2>`;

    if (data.bucket && data.bucket.length > 0) {
        data.bucket.forEach((bucket, index) => {
            const steps = bucket.dataset[0].point.reduce((total, point) => {
                return total + (point.value[0].intVal || 0);
            }, 0);
            fitDataDiv.innerHTML += `<p>Dia ${index + 1}: ${steps} passos</p>`;
        });
    } else {
        fitDataDiv.innerHTML += `<p>Não foram encontrados dados de passos para os últimos 7 dias.</p>`;
    }
}