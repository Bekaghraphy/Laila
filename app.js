// Preview Uploaded Image
const fileInput = document.getElementById("fileInput");
const previewHolder = document.getElementById("previewHolder");

fileInput.addEventListener("change", function() {
    const file = this.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    previewHolder.innerHTML = "";
    previewHolder.appendChild(img);
});

// Buttons
document.getElementById("btnPrompt").addEventListener("click", () => {
    alert("Prompt generation will be connected soon!");
});

document.getElementById("btnGenerate").addEventListener("click", () => {
    alert("Image generation will be connected soon!");
});
