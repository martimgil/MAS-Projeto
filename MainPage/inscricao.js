$(document).ready(function(){
    function pagamento(){
        var option = $("#pagamento").val();
        var pagamentoInfo = $("#pagamento-info");

        pagamentoInfo.empty();

        if (option == "cartao"){
            pagamentoInfo.html("<div style='display: flex; align-items: center; justify-content: center;'><img src='OutrasImagens/cartao.png' style='width: 200px; height: auto; margin-right: 10px;'/><div><p>Possui 9,74€ no seu cartão de estudante.</p><p>Pode efetuar o seu carregamento em <a href='https://mysas.ua.pt'>mysas.ua.pt</a> ou nos quiosques disponíveis no campus</p><p>Custo: 2€ (preço de não sócio da AAUAv)</p></div></div>");
        } else if (option == "mbway") {
            pagamentoInfo.html("<div class='form-floating mb-3'><input type='text' class='form-control' id='ntelemovel' placeholder='Insira o seu número associado ao MBWay' required><label for='ntelemovel'>Telemóvel associado ao MBWay</label><div class='invalid-feedback'>Por favor, insira o seu número de telemóvel associado ao MBWay</div></div>");
        }
    }

    $("#pagamento").change(pagamento);

    $("#loginForm").submit(function(event){
        event.preventDefault();
        confirmar();
    });

    window.confirmar = function(){
        var ntelemovel = $("#ntelemovel").val();
        var pagamento = $("#pagamento").val();

        if (pagamento == "mbway"){
            alert("Foi enviado um pedido de pagamento para o número " + ntelemovel + ". Por favor, confirme o pagamento na sua aplicação. Quando este for confirmado a sua inscrição será efetuada.");
            goToProgresso();
        } else {
            alert("Pagamento efetuado com sucesso! Inscrição realizada com sucesso!");
            goToProgresso();
        }
    };

      function goToProgresso(){
        const storedData = JSON.parse(localStorage.getItem("marcacoes")) || [];
        const urlParams = new URLSearchParams(window.location.search);
        const modalidade = urlParams.get('modalidade');
        const horario = $("#horario").val();

        const newData = `Aula de ${modalidade} - ${horario}`;
        storedData.push(newData);
        localStorage.setItem("marcacoes", JSON.stringify(storedData));
        window.location.href = "progresso.html";
    }

    function getData(){
        const urlParams = new URLSearchParams(window.location.search);
        const modalidade = urlParams.get('modalidade');

        if (modalidade) {
            console.log(`Modalidade encontrada: ${modalidade}`);
        } else {
            console.log('Modalidade não encontrada na URL.');
        }
    }
    function getHorario() {
        const urlParams = new URLSearchParams(window.location.search);
        const modalidade = urlParams.get('modalidade');
        if (modalidade) {
            $.getJSON('horarios.json', function(data) {
                const modalidadeData = data.modalidades.find(m => m.nome === modalidade);
                if (modalidadeData) {
                    console.log(`Horários para ${modalidade}:`);
                    modalidadeData.horarios.forEach(horario => {
                        console.log(`Dia: ${horario.dia}, Início: ${horario.inicio}, Fim: ${horario.fim}`);
                        $('#horario').append(`<option value="${horario.dia} ${horario.inicio}-${horario.fim}">${horario.dia} - ${horario.inicio} às ${horario.fim}</option>`);
                    });
                } else {
                    console.log(`Horário não encontrado para a modalidade: ${modalidade}`);
                }
            }).fail(function() {
                console.log('Erro ao carregar o ficheiro horarios.json');
            });
        } else {
            console.log('Modalidade não encontrada na URL.');
        }
    }

    function getPersonalData() {
        const personalData = JSON.parse(localStorage.getItem('personalData'));
        if (personalData){
            $('#nome').val(personalData.nome);
            $('#nmec').val(personalData.nmec);
            $('#ntelemovel').val(personalData.ntelemovel);
        }
    }

    getPersonalData();
    getData();
    getHorario();
});