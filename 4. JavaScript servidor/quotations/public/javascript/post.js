const main = document.getElementById('main');
const authorField = document.getElementById('authorField');
const excerptField = document.getElementById('excerptField');
const saveDataButton = document.getElementById('saveDataButton');
const endMessage = document.getElementById('endMessage');
const result = document.getElementById('result');

saveDataButton.addEventListener('click', saveData);

function saveData() {
  const defaultValue = 'unknown';
  const payLoad = JSON.stringify({
    author: authorField.value.trim() || defaultValue,
    excerpt: excerptField.value.trim() || defaultValue
  });
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/quotations');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {
    result.innerText = xhr.responseText;
    main.style.display = 'none';
    endMessage.style.display = 'block';
  };
  xhr.send(payLoad);
}
