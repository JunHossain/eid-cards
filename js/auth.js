const modal = document.getElementById("cardPasswordModal");
const modalTitle = document.getElementById("cardPasswordTitle");
const passwordInput = document.getElementById("cardPasswordInput");
const passwordSubmit = document.getElementById("cardPasswordSubmit");
const passwordCancel = document.getElementById("cardPasswordCancel");
const passwordError = document.getElementById("cardPasswordError");

let pendingHref = "";
let pendingCardKey = "";

/*
  Replace these hash strings with your real hashes.
  masterHash = hash of your master password
  cardHashes = hash of each person's password
*/
const masterHash = "PUT_MASTER_HASH_HERE";

const cardHashes = {
  Anisha: "24a489aa2add9a5f0c9b341ddd0a05d38a3baf61a5b4631c83e52fc8fb8504c3",
  Arkive: "2a0deae6336d7e934315c4af8cf5c5b7e140da9fe5b0e2525a537188e08b4a67",
  Ema: "d740b3046e0a62b2e567a877c47fa2c4c1504c6f43acd61d3076283c257b0671",
  Fairoj: "dc2314f11ab82715e0e5d2ad3f5c4cd77aecc0b7a7862ff5476733613dae5260",
  Joti: "384670e7f0d862ca9e3eecdb1b6f325a5b4767cd3a8b968371f7f58a35ba1eac",
  Mome: "f677e712f101c7677e634fd5597e54f8e1a06a2591a2a087afd0045d2e3c9232",
  Mou: "23e4c48e69981506d520bf8b396a2e8448012c7335bf9ad7f2bc2d89a873230a",
  Nazmul: "d6ef162d0699f312d6bd7f84b21e08831d794443516a7795121e1a64ab2d3290",
  Sadiya: "ca97724dca61e7575e1f46ca9765eea75c2f859cb4ca397ec1c0d812d9f7f250",
  Shimanto: "6ef50feef1d07e00b22610e26f27f2668aab43333daa4bb8ed4668aaf4b9ddcc",
  Sukanta: "d6ef162d0699f312d6bd7f84b21e08831d794443516a7795121e1a64ab2d3290",
  Turjo: "24a489aa2add9a5f0c9b341ddd0a05d38a3baf61a5b4631c83e52fc8fb8504c3",
};

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function openModal(cardKey, href, displayName) {
  pendingCardKey = cardKey;
  pendingHref = href;
  modalTitle.textContent = `Enter password for ${displayName}`;
  passwordInput.value = "";
  passwordError.textContent = "";
  modal.style.display = "flex";
  passwordInput.focus();
}

function closeModal() {
  modal.style.display = "none";
  pendingHref = "";
  pendingCardKey = "";
  passwordInput.value = "";
  passwordError.textContent = "";
}

document.querySelectorAll(".protected-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const cardKey = this.dataset.card;
    const href = this.getAttribute("href");
    const displayName = this.textContent.trim();
    openModal(cardKey, href, displayName);
  });
});

passwordCancel.addEventListener("click", closeModal);

modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
});

passwordInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    passwordSubmit.click();
  }
});

passwordSubmit.addEventListener("click", async function () {
  const entered = passwordInput.value;
  if (!entered) {
    passwordError.textContent = "Please enter a password.";
    return;
  }

  const enteredHash = await sha256(entered);
  const cardHash = cardHashes[pendingCardKey];

  if (enteredHash === cardHash || enteredHash === masterHash) {
    window.location.href = pendingHref;
  } else {
    passwordError.textContent = "Wrong password.";
  }
});
