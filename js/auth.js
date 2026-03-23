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
const masterHash =
  "97632c458af58dc3b9d9cdd9f39514bd25ca861e61e2881ac89bcc185a2d2491";

const cardHashes = {
  Akif: "781ea259e614a394c7cc1b0ad38af3764255415c6d1a6564c8a0b772b802f60c",
  Anisha: "24a489aa2add9a5f0c9b341ddd0a05d38a3baf61a5b4631c83e52fc8fb8504c3",
  Arkive: "2a0deae6336d7e934315c4af8cf5c5b7e140da9fe5b0e2525a537188e08b4a67",
  Ema: "d740b3046e0a62b2e567a877c47fa2c4c1504c6f43acd61d3076283c257b0671",
  Fabia: "f0d79e386c0afda27a2696ccf5de764a4acc6ec164502e2fc3c59bc23a76cb16",
  Fairoj: "dc2314f11ab82715e0e5d2ad3f5c4cd77aecc0b7a7862ff5476733613dae5260",
  Faria: "f0d79e386c0afda27a2696ccf5de764a4acc6ec164502e2fc3c59bc23a76cb16",
  Iqra: "770a960deccb42f59bb9239aa5c5e12622efaf5de5ec7ed87addc50574a04d42",
  Joti: "384670e7f0d862ca9e3eecdb1b6f325a5b4767cd3a8b968371f7f58a35ba1eac",
  Joyl: "8dbc1b23bb7b97160e34de50a6e308b1e21c3c63dee78c926cfa7a9ac0eb29d7",
  Mahfuz: "216c1eeebade8fe77e27c5978ed41d608264dfcec91506f7971dae44e95d2be2",
  Mome: "f677e712f101c7677e634fd5597e54f8e1a06a2591a2a087afd0045d2e3c9232",
  Mominul: "ef6bc5709437bf0224f1c30efbb4fc83a44cf131a4e2e54ead33740c03bd8d0b",
  Momit: "00198edda99a555d56c3f5f6e82b361b98523af6380184c3bd59908b4eab6b4c",
  Mou: "23e4c48e69981506d520bf8b396a2e8448012c7335bf9ad7f2bc2d89a873230a",
  Naimur: "34bd5797d909d5712a4c10938fb00805d7a6aff23bd54dcc8fea50ba36e20b18",
  Nazmul: "d6ef162d0699f312d6bd7f84b21e08831d794443516a7795121e1a64ab2d3290",
  Sadiya: "ca97724dca61e7575e1f46ca9765eea75c2f859cb4ca397ec1c0d812d9f7f250",
  Samir: "770a960deccb42f59bb9239aa5c5e12622efaf5de5ec7ed87addc50574a04d42",
  Shimanto: "6ef50feef1d07e00b22610e26f27f2668aab43333daa4bb8ed4668aaf4b9ddcc",
  Soma: "384670e7f0d862ca9e3eecdb1b6f325a5b4767cd3a8b968371f7f58a35ba1eac",
  Sukanta: "d6ef162d0699f312d6bd7f84b21e08831d794443516a7795121e1a64ab2d3290",
  Tanju: "9726f81da9c9531b83e559e7328b1c7965f593d3865ab69d1e188a3e6e72f644",
  Tayaib: "3515a5fb1fb33678e79d114da730d85c32cb24ecf43b8abc4c86e0b3c3cf05c0",
  Turjo: "24a489aa2add9a5f0c9b341ddd0a05d38a3baf61a5b4631c83e52fc8fb8504c3",
  Wasi: "1e45e9b8c24df525e03b95d16acf152cb89e9e6dd6b23a0f92bc8c6b4edafd2c",
};

const accessMap = {
  Akif: "access_Akif",
  Anisha: "access_Anisha",
  Arkive: "access_Arkive",
  Ema: "access_Ema",
  Fabia: "access_Fabia",
  Fairoj: "access_Fairoj",
  Faria: "access_Faria",
  Iqra: "access_Iqra",
  Joti: "access_Joti",
  Joy: "access_Joy",
  Mahfuz: "access_Mahfuz",
  Mome: "access_Mome",
  Mominul: "access_Mominul",
  Momit: "access_Momit",
  Mou: "access_Mou",
  Naimur: "access_Naimur",
  Nazmul: "access_Nazmul",
  Sadiya: "access_Sadiya",
  Samir: "access_Samir",
  Shimanto: "access_Shimanto",
  Soma: "access_Soma",
  Sukanta: "access_Sukanta",
  Tanju: "access_Tanju",
  Tayaib: "access_Tayaib",
  Turjo: "access_Turjo",
  Wasi: "access_Wasi",
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
    sessionStorage.setItem(accessMap[pendingCardKey], "granted");
    window.location.href = pendingHref;
  } else {
    passwordError.textContent = "Wrong password.";
  }
});
