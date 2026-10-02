console.log("jsDelivr loader loaded");

const message = document.createElement('div');
message.textContent = 'Remote script loaded from jsDelivr via GitHub.';
message.style.cssText = 'padding: 20px; font-family: sans-serif; color: #111;';
document.body.appendChild(message);
