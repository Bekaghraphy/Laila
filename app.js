/***************************************************************
 * LAILA AI – Frontend Logic (UI + Backend)
 * Production Version – 2025
 ***************************************************************/

// =======================
// ELEMENTS
// =======================
const fileInput = document.getElementById("fileInput");
const previewHolder = document.getElementById("previewHolder");
const btnPrompt = document.getElementById("btnPrompt");
const btnGenerate = document.getElementById("btnGenerate");
const promptOutput = document.getElementById("promptOutput");
const langSwitch = document.getElementById("langSwitch");

let currentLang = "en";
const backendURL = "https://d10e6243-c63b-49f1-be59-b43234a56af4-00-18q80rsc3iyxb.sisko.replit.dev/";


// =======================
// PREVIEW IMAGE
// =======================
fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.className = "preview-img";

    previewHolder.innerHTML = "";
    previewHolder.appendChild(img);
});


// =======================
// LANGUAGE SWITCH
// =======================
langSwitch.addEventListener("click", () => {
    langSwitch.classList.toggle("arabic");
    currentLang = currentLang === "en" ? "ar" : "en";

    currentLang === "en" ? applyEnglish() : applyArabic();
});

function applyEnglish() {
    document.querySelector(".title").textContent = "LAILA AI";
    document.querySelector(".upload-label").textContent = "Upload Photo";
    btnPrompt.textContent = "Generate Prompt";
    btnGenerate.textContent = "Generate Image";
    promptOutput.placeholder = "Generated prompt will appear here...";
}

function applyArabic() {
    document.querySelector(".title").textContent = "ليلى الذكية";
    document.querySelector(".upload-label").textContent = "ارفع صورة";
    btnPrompt.textContent = "إنشاء برومبت";
    btnGenerate.textContent = "توليد صورة";
    promptOutput.placeholder = "سيظهر البرومبت هنا...";
}


// =======================
// SHOW LOADING STATE
// =======================
function setLoading(state, message = "") {
    if (state) {
        promptOutput.value = message;
        promptOutput.classList.add("loading");
    } else {
        promptOutput.classList.remove("loading");
    }
}


// =======================
// API: UPLOAD IMAGE + GET PROMPT
// =======================
async function generateDescription() {
    const file = fileInput.files[0];

    if (!file) {
        promptOutput.value = currentLang === "en"
            ? "Please upload an image first."
            : "من فضلك ارفع صورة أولاً.";
        return;
    }

    setLoading(true, currentLang === "en"
        ? "Generating prompt… please wait."
        : "جاري إنشاء البرومبت… انتظر لحظة.");

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`${backendURL}/generate-description`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            promptOutput.value = result.description;
        } else {
            promptOutput.value = "Error: No description returned.";
        }
    } catch (err) {
        promptOutput.value = "Failed to connect to backend.";
        console.error(err);
    }

    setLoading(false);
}


// =======================
// API: GENERATE IMAGE (COMING SOON)
// =======================
async function generateImage() {
    promptOutput.value = currentLang === "en"
        ? "Image generation not connected yet."
        : "ميزة توليد الصور لم تُفعّل بعد.";
}


// =======================
// BUTTON ACTIONS
// =======================
btnPrompt.addEventListener("click", generateDescription);
btnGenerate.addEventListener("click", generateImage);

