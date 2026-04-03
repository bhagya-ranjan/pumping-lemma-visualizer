document.addEventListener("DOMContentLoaded", () => {

    const simulateBtn = document.getElementById('simulateBtn');
    const splitArea = document.getElementById('splitArea');
    const pumpControls = document.getElementById('pumpControls');
    const pumpVisualizer = document.getElementById('pumpVisualizer');
    const resultString = document.getElementById('resultString');
    const resultBox = document.getElementById('resultBox');
    const resultIcon = document.getElementById('resultIcon');
    const conclusion = document.getElementById('conclusion');

    const finalText = document.getElementById("finalText");
    const theoryText = document.getElementById("theoryText");

    let currentParts = { x: '', y: '', z: '' };
    let testResults = [];

    simulateBtn.addEventListener('click', () => {

        const input = document.getElementById('stringInput').value || 'aaabbb';

        currentParts.x = input.charAt(0);
        currentParts.y = input.charAt(1);
        currentParts.z = input.slice(2);

        document.getElementById('dispX').innerText = currentParts.x;
        document.getElementById('dispY').innerText = currentParts.y;
        document.getElementById('dispZ').innerText = currentParts.z;

        splitArea.classList.remove('hidden');
        pumpControls.classList.remove('hidden');

        showDefaultVisualization();  

        runFullTest();
    });
    function showDefaultVisualization() {
    pumpVisualizer.innerHTML = '';

    addPartToVisual(currentParts.x, 'part-x');
    addPartToVisual(currentParts.y, 'part-y');
    addPartToVisual(currentParts.z, 'part-z');
}

    function runFullTest() {
    console.log("Running full test...");

    testResults = [];
    let resultHTML = ``;

    for (let k = 0; k <= 5; k++) {
        const str = currentParts.x + currentParts.y.repeat(k) + currentParts.z;
        const valid = checkLanguage(str);

        console.log("k:", k, str, valid);

        testResults.push(valid);

        resultHTML += `
            <div class="flex justify-between items-center px-3 py-2 rounded-lg 
                ${valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">

                <span>k = ${k}</span>
                <span>${str}</span>
                <span>${valid ? '✔' : '✖'}</span>
            </div>
        `;
    }

    if (resultString) {
        resultString.innerHTML = resultHTML;
    } else {
        console.error("resultString not found!");
    }

    finalConclusion();
}

    function checkLanguage(str) {
        const lang = document.getElementById('langSelect').value;

        if (lang === 'anbn') {
            const as = (str.match(/a/g) || []).length;
            const bs = (str.match(/b/g) || []).length;
            return (as === bs && as > 0);
        } else if (lang === 'astar') {
            return /^a*$/.test(str);
        } else if (lang === 'even0') {
            const zeros = (str.match(/0/g) || []).length;
            return (zeros % 2 === 0);
        } else if (lang === 'end01') {
            return str.endsWith('01');
        }

        return false;
    }

    function finalConclusion() {
        const allValid = testResults.every(v => v === true);

        conclusion.classList.remove('hidden');

        if (allValid) {
            resultIcon.innerHTML = "✔";
            conclusion.className = "mt-6 p-5 rounded-2xl bg-green-50 border border-green-200 text-green-800 fade-in";

            finalText.innerText =
                "All tested values of k satisfy the language.";

            theoryText.innerText =
                "According to Pumping Lemma, this language MAY be regular (not guaranteed).";

        } else {
            resultIcon.innerHTML = "✖";
            conclusion.className = "mt-6 p-5 rounded-2xl bg-red-50 border border-red-200 text-red-800 fade-in";

            finalText.innerText =
                "At least one value of k breaks the language.";

            theoryText.innerText =
                "According to Pumping Lemma, if any pumped string fails, the language is NOT regular.";
        }
    }

    function addPartToVisual(text, className) {
        const span = document.createElement('span');
        span.className = className;
        span.innerText = text;
        pumpVisualizer.appendChild(span);
    }

});