const fixedObjectiveCount = 5;
let objectives = JSON.parse(localStorage.getItem('objectives')) || [];
let completedObjectives = new Set(JSON.parse(localStorage.getItem('completedObjectives')) || []);

document.addEventListener('DOMContentLoaded', () => {
    renderObjectives();
    updateProgressBar();
});

function saveToLocalStorage() {
    localStorage.setItem('objectives', JSON.stringify(objectives));
    localStorage.setItem('completedObjectives', JSON.stringify(Array.from(completedObjectives)));
}

function addObjective() {
    const input = document.getElementById('newObjective');
    const value = input.value.trim();
    if (value && objectives.length < fixedObjectiveCount) {
        objectives.push(value);
        input.value = '';
        saveToLocalStorage();
        renderObjectives();
    } else if (objectives.length >= fixedObjectiveCount) {
        alert(`Só podes adicionar ${fixedObjectiveCount} objetivos!`);
    }
}

function renderObjectives() {
    const list = document.getElementById('objectiveList');
    list.innerHTML = '';
    objectives.forEach((obj, index) => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        label.innerText = obj;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completedObjectives.has(index);
        checkbox.disabled = completedObjectives.has(index); // Impede que o objetivo seja desmarcado
        checkbox.onchange = () => toggleCompletion(index);

        li.appendChild(checkbox);
        li.appendChild(label);
        list.appendChild(li);
    });
    updateProgressBar();
}

function toggleCompletion(index) {
    if (!completedObjectives.has(index)) {
        completedObjectives.add(index);
    }
    saveToLocalStorage();
    renderObjectives();
    updateProgressBar();
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (completedObjectives.size / fixedObjectiveCount) * 100;
    progressBar.style.width = progress + '%';
    progressBar.innerText = Math.round(progress) + '%';

    if (completedObjectives.size === fixedObjectiveCount) {

        alert("Parabéns, recebeste a tua recompensa!");


        objectives = [];
        completedObjectives.clear();
        saveToLocalStorage();
        renderObjectives();
    }
}