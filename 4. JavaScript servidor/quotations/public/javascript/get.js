const items = document.getElementById('items');

getQuotations();

function getQuotations() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/quotations');
  xhr.onload = () => {
    const body = JSON.parse(xhr.responseText);
    let result = '';
    for (const row of body) {
      result += `
        <li>
          ${row.author}:
          <a href="${row.url}">
            ${row.prelude}
          </a>
        </li>
      `;
    }
    items.innerHTML = result;
  };
  xhr.send();
}
