// Verificar se jsPDF está disponível
if (window.jspdf && window.jspdf.jsPDF) {
    console.log('jsPDF carregado com sucesso.');
} else {
    console.error('Erro ao carregar jsPDF. Verifique a importação da biblioteca.');
}

// Função que será adicionada em todos os elementos da classe .btn
document.querySelectorAll('.btn').forEach((button) => {
    document.getElementById(button.id).addEventListener('click', () => {
        voting(button);
    });
});

let num1 = document.getElementById('num1');
let num2 = document.getElementById('num2');
let sondNumber = document.getElementById('sondNumber');
let sondConfirm = document.getElementById('sondConfirm');

let voteCount = {
    antonio: 0,
    fernandes: 0,
    pascoal: 0,
    branco: 0,
    invalido: 0
};

function voting(button) {
    if (!num1.value) {
        num1.innerHTML = button.value;
        num1.value = button.value;
        sondNumber.play();
        return;
    } else if (!num2.value) {
        num2.innerHTML = button.value;
        num2.value = button.value;
        sondNumber.play();
        showCandidate();
    }
}

let nameTitle = document.getElementById('nameTitle');
let nameCandidate = document.getElementById('nameCandidate');
let broken = document.getElementById('brokenCandidate');
let img = document.getElementById('imgPresident');
let legend = document.getElementById('legend');

function showCandidate() {
    if (num1.value == '1' && num2.value == '8') {
        nameTitle.innerText = candidato.antonio.name;
        nameCandidate.innerHTML = `Nome: <b>${candidato.antonio.nameComplete}</b>`;
        broken.innerHTML = `Partido: <b>${candidato.antonio.broken}</b>`;
        img.style.backgroundImage = candidato.antonio.img;
        legend.style.display = 'flex';
    } else if (num1.value == '3' && num2.value == '3') {
        nameTitle.innerText = candidato.fernandes.name;
        nameCandidate.innerHTML = `Nome: <b>${candidato.fernandes.nameComplete}</b>`;
        broken.innerHTML = `Partido: <b>${candidato.fernandes.broken}</b>`;
        img.style.backgroundImage = candidato.fernandes.img;
        legend.style.display = 'flex';
    } else if (num1.value == '5' && num2.value == '2') {
        nameTitle.innerText = candidato.pascoal.name;
        nameCandidate.innerHTML = `Nome: <b>${candidato.pascoal.nameComplete}</b>`;
        broken.innerHTML = `Partido: <b>${candidato.pascoal.broken}</b>`;
        img.style.backgroundImage = candidato.pascoal.img;
        legend.style.display = 'flex';
    } else {
        nameTitle.innerText = 'INVALIDO';
        nameCandidate.innerText = 'INVALIDO';
        broken.innerText = 'INVALIDO';
        img.style.backgroundImage = "url('./images/person-icon.png')";
        legend.style.display = 'none';
        num1.value = null;
        num2.value = null;
    }
}

document.getElementById('btnConfirm').addEventListener('click', confirmVote);

function confirmVote() {
    if (document.getElementById('end').style.display == 'flex') {
        correct();
    } else {
        if (num1.value != null && num2.value != null) {
            document.getElementById('end').style.display = 'flex';
            sondConfirm.play();
            countVote();
        } else {
            console.log('INVALIDO');
        }
    }
}

function countVote() {
    console.log('Contando voto...');
    if (num1.value == '1' && num2.value == '8') {
        voteCount.antonio++;
    } else if (num1.value == '3' && num2.value == '3') {
        voteCount.fernandes++;
    } else if (num1.value == '5' && num2.value == '2') {
        voteCount.pascoal++;
    } else if (num1.value == '0' && num2.value == '0') {
        voteCount.branco++;
    } else {
        voteCount.invalido++;
    }

    console.log('Votos atuais:', voteCount);

    // Gere o PDF a cada 5 votos
    let totalVotes = voteCount.antonio + voteCount.fernandes + voteCount.pascoal + voteCount.branco + voteCount.invalido;
    if (totalVotes % 5 === 0 && totalVotes > 0) {
        generatePDF();
    }
}

document.getElementById('btnReplace').addEventListener('click', correct);

function correct() {
    nameTitle.innerText = 'CANDIDATO';
    nameCandidate.innerText = 'Nome:';
    broken.innerText = 'Partido:';
    num1.innerText = '';
    num2.innerText = '';
    num1.value = null;
    num2.value = null;
    sondNumber.play();
    img.style.backgroundImage = "url('./images/person-icon.png')";
    legend.style.display = 'none';
    document.getElementById('end').style.display = 'none';
}

document.getElementById('btnWhite').addEventListener('click', voteWhite);

function voteWhite() {
    nameTitle.innerText = 'VOTAR EM BRANCO';
    nameCandidate.innerText = '';
    broken.innerText = '';
    num1.innerText = '0';
    num2.innerText = '0';
    num1.value = '0';
    num2.value = '0';
    sondNumber.play();
    img.style.backgroundImage = "url('./images/person-icon.png')";
    legend.style.display = 'none';
}

let candidato = {
    antonio: {
        name: 'PREFEITO',
        nameComplete: 'ANTONIO PACHECO',
        broken: 'TICO',
        img: "url('./images/antonio.webp')",
    },
    fernandes: {
        name: 'PREFEITO',
        nameComplete: 'FERNANDES COSTA',
        broken: 'SPB',
        img: "url('./images/fernandes.jpg')",
    },
    pascoal: {
        name: 'PREFEITO',
        nameComplete: 'PASCOAL FERNANDES COSTA',
        broken: 'BPDT',
        img: "url('./images/pascoal.jpg')",
    },
};

function generatePDF() {
    console.log('Gerando PDF...');
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error('jsPDF não está disponível.');
        return;
    }
    const doc = new jsPDF();

    doc.text("Resultados da Votação", 10, 10);
    doc.text(`Antonio Pacheco: ${voteCount.antonio}`, 10, 20);
    doc.text(`Fernandes Costa: ${voteCount.fernandes}`, 10, 30);
    doc.text(`Pascoal Fernandes: ${voteCount.pascoal}`, 10, 40);
    doc.text(`Votos em Branco: ${voteCount.branco}`, 10, 50);
    doc.text(`Votos Inválidos: ${voteCount.invalido}`, 10, 60);

    doc.save("resultados_votacao.pdf");

    // Reset contagem de votos
    voteCount = {
        antonio: 0,
        fernandes: 0,
        pascoal: 0,
        branco: 0,
        invalido: 0
    };
}
