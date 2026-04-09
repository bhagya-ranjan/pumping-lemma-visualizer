document.addEventListener("DOMContentLoaded", () => {

    const simulateBtn = document.getElementById('simulateBtn');
    const kButtons = document.getElementById('kButtons');
    const kDetails = document.getElementById('kDetails');

    let currentParts = { x: '', y: '', z: '' };

    //SIMULATE BUTTON
    simulateBtn.addEventListener('click', () => {
        
    const input = document.getElementById('stringInput').value;
    const errorBox = document.getElementById('errorBox');
    const topHead = document.getElementById('topHead');
    const theorySection = document.getElementById('theorySection');
    const finalConclusion = document.getElementById('finalConclusion');
    finalConclusion.classList.add('hidden');
    const error = validateInput(input);
    topHead.classList.add("hidden");
    kButtons.innerHTML = "";
    kDetails.innerHTML = "";
    if (error) {
        errorBox.innerText = error;
        errorBox.classList.remove('hidden');
        theorySection.classList.add('hidden'); // hide if error
        return;
    }
    topHead.classList.remove("hidden");
    errorBox.classList.add('hidden');

    // show theory + conclusion
    theorySection.classList.remove('hidden');

    // existing logic
    currentParts.x = input.charAt(0);
    currentParts.y = input.charAt(1);
    currentParts.z = input.slice(2);

    generateKButtons();
    kDetails.innerHTML = "";
    computeConclusion();
});

    // 🔹 GENERATE K BUTTONS
    function generateKButtons() {

        kButtons.innerHTML = "";

        for (let k = 0; k <= 9; k++) {

            const btn = document.createElement("button");
            btn.innerText = `k = ${k}`;

            btn.className = `
                px-4 py-2 rounded-lg text-sm font-semibold
                bg-slate-800 text-white
                hover:bg-blue-600 transition
            `;

            btn.onclick = () => showK(k);

            kButtons.appendChild(btn);
        }
    }

    // 🔹 SHOW EXPANDED RESULT
    function showK(k) {
        
        const { x, y, z } = currentParts;

        const pumpedY = y.repeat(k);
        const resultStr = x + pumpedY + z;
        const valid = checkLanguage(resultStr);
        let explanation = "";

        const lang = document.getElementById('langSelect').value;

        if (lang === 'anbn') {
            explanation = valid
                ? "Number of a's equals number of b's, so string remains valid."
                : "After pumping, number of a's and b's are unequal → violates aⁿbⁿ.";
        } else if (lang === 'astar') {
            explanation = valid
                ? "All characters are 'a', so string remains valid."
                : "String contains characters other than 'a' → invalid.";
        } else if (lang === 'even0') {
            explanation = valid
                ? "Number of 0s is even."
                : "Number of 0s becomes odd → invalid.";
        } else if (lang === 'end01') {
            explanation = valid
                ? "String still ends with 01."
                : "Ending pattern breaks → invalid.";
        }

        kDetails.innerHTML = `
        <div class="p-5 rounded-xl border bg-slate-50 fade-in">

            <!-- Animated Split -->
            <div class="flex justify-center gap-3 text-xl font-mono mb-4">

                <span class="part-x">${x}</span>

                <span class="part-y animate-pulse">
                    ${k === 0 ? "ε" : y.repeat(k)}
                </span>

                <span class="part-z">${z}</span>

            </div>

            <!-- Result String -->
            <div class="text-center font-mono text-lg mb-2">
                ${resultStr}
            </div>

            <!-- Validity -->
            <div class="text-center font-bold ${valid ? 'text-green-500' : 'text-red-500'}">
                ${valid ? '✔ Belongs to L' : '❌ Does not belong to given Language'}
            </div>

            <!-- Explanation -->
            <div class="mt-3 text-sm text-slate-600 leading-relaxed text-center">
                ${explanation}
            </div>

        </div>
        `;
    }

    //LANGUAGE CHECK
    function checkLanguage(str) {

        const lang = document.getElementById('langSelect').value;

        if (lang === 'anbn') {
            const as = (str.match(/a/g) || []).length;
            const bs = (str.match(/b/g) || []).length;
            return (as === bs && as > 0);
        }

        else if (lang === 'astar') {
            return /^a*$/.test(str);
        }

        else if (lang === 'even0') {
            const zeros = (str.match(/0/g) || []).length;
            return (zeros % 2 === 0);
        }

        else if (lang === 'end01') {
            return str.endsWith('01');
        }

        return false;
    }

    function validateInput(str) {

    const lang = document.getElementById('langSelect').value;

    if (!str || str.length === 0) {
        return "Please enter a string.";
    }

    if (lang === 'anbn') {
        if (!/^a+b+$/.test(str)) {
            return "String must be in format aⁿbⁿ (only a's followed by b's).";
        }
    }

    else if (lang === 'astar') {
        if (!/^a*$/.test(str)) {
            return "String must contain only 'a'.";
        }
    }

    else if (lang === 'even0') {
        if (!/^[01]+$/.test(str)) {
            return "String must be binary (0s and 1s only).";
        }
    }

    else if (lang === 'end01') {
        if (!/^[01]+$/.test(str)) {
            return "String must be binary (0s and 1s only).";
        }
    }

    return null; // valid
}

function computeConclusion() {

    const finalConclusion = document.getElementById('finalConclusion');
    const finalText = document.getElementById('finalConclusionText');

    let allValid = true;

    for (let k = 0; k <= 9; k++) {

        const str = currentParts.x + currentParts.y.repeat(k) + currentParts.z;
        const valid = checkLanguage(str);

        if (!valid) {
            allValid = false;
            break;
        }
    }

    finalConclusion.classList.remove('hidden');

    if (allValid) {

        finalConclusion.className =
            "mt-10 p-6 rounded-2xl border fade-in bg-green-50 border-green-200";

        finalText.innerHTML = `
            All tested cases satisfy the language.<br>
            We cannot assure whether the language is regular or not.
        `;

    } else {

        finalConclusion.className =
            "mt-10 p-6 rounded-2xl border fade-in bg-gradient-to-r from-red-50 via-pink-50 to-orange-50 border-red-200";

        finalText.innerHTML = `
            Since we have shown that for every valid decomposition 
            <strong>s = xyz</strong> (where <strong>|y| ≥ 1</strong> and <strong>|xy| ≤ p</strong>), 
            there exists an integer <strong>i ≥ 0</strong> such that the pumped string 
            <strong>xy<sup>i</sup>z ∉ L</strong>, the string <strong>s</strong> cannot be pumped.<br><br>

            This directly contradicts the Pumping Lemma. Therefore, our initial assumption 
            that <strong>L</strong> is a regular language must be false, and we conclude that L is
            <strong class="text-red-600 font-mono text-xl animate-pulse">NON-REGULAR </strong>.
        `;
    }
}

});