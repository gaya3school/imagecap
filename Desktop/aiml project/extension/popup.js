const button = document.getElementById("generate");
const pasteArea = document.getElementById("pasteArea");
let pastedImageBase64 = null;

// Listen for paste events in the paste area
pasteArea.addEventListener("paste", (event) => {
  const items = event.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      const blob = items[i].getAsFile();
      const reader = new FileReader();
      reader.onloadend = (evt) => {
      pastedImageBase64 = evt.target.result;
      pasteArea.innerHTML = '<img src="' + pastedImageBase64 + '" style="max-width:100%;"/>';
      };
      reader.readAsDataURL(blob);
      event.preventDefault();
      break;
    }
  }
});

button.addEventListener("click", async () => {
  let base64Image = null;
  const fileInput = document.getElementById("image");
  const file = fileInput.files[0];

  if (pastedImageBase64) {
    base64Image = pastedImageBase64;
  } else if (file) {
    // Read uploaded file as base64 if no paste image present
    const reader = new FileReader();
    reader.onloadend = async () => {
      base64Image = reader.result;
      await sendImage(base64Image);
    };
    reader.readAsDataURL(file);
    return;
  } else {
    alert("Paste or upload an image first!");
    return;
  }

  await sendImage(base64Image);
});

async function sendImage(base64Image) {
  const captionElem = document.getElementById("caption");
  captionElem.innerText = "Caption is being generated...";

  try {
    const res = await fetch("http://127.0.0.1:5000/caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image })
    });
    const data = await res.json();
    captionElem.innerText = "Caption: " + data.caption;
  } catch (err) {
    captionElem.innerText = "Error: " + err;
  }
}

