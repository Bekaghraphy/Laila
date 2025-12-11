// PREVIEW IMAGE
const fileInput = document.getElementById("fileInput");
const previewHolder = document.getElementById("previewHolder");

fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    previewHolder.innerHTML = "";
    previewHolder.appendChild(img);
});

// LANGUAGE SWITCH
let currentLang = "en";

const langSwitch = document.getElementById("langSwitch");
const title = document.querySelector(".title");
const uploadLabel = document.querySelector(".upload-label");
const btnPrompt = document.getElementById("btnPrompt");
const btnGenerate = document.getElementById("btnGenerate");
const promptOutput = document.getElementById("promptOutput");

langSwitch.addEventListener("click", () => {
    langSwitch.classList.toggle("arabic");

    if (currentLang === "en") {
        currentLang = "ar";
        applyArabic();
    } else {
        currentLang = "en";
        applyEnglish();
    }
});

// ENGLISH TEXTS
function applyEnglish() {
    title.textContent = "LAILA AI";
    uploadLabel.textContent = "Upload Photo";
    btnPrompt.textContent = "Generate Prompt";
    btnGenerate.textContent = "Generate Image";
    promptOutput.placeholder = "Generated prompt will appear here...";
}

// ARABIC TEXTS
function applyArabic() {
    title.textContent = "ليلى الذكية";
    uploadLabel.textContent = "ارفع صورة";
    btnPrompt.textContent = "إنشاء برومبت";
    btnGenerate.textContent = "توليد صورة";
    promptOutput.placeholder = "سيظهر البرومبت هنا...";
}
