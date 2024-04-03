const excerpt = document.getElementById('excerpt');
const author = document.getElementById('author');

getRandomQuotation();

function getRandomQuotation() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/quotations');
  xhr.onload = () => {
    const body = JSON.parse(xhr.responseText);
    const max_quotations = body.length;
    if (max_quotations > 0) {
      const randomIndex = Math.floor(Math.random() * max_quotations);
      const randomQuotationUrl = body[randomIndex].url;
      xhr.open('GET', randomQuotationUrl);
      xhr.onload = () => {
        const body = JSON.parse(xhr.responseText);
        excerpt.innerText = body.excerpt;
        author.innerText = '\u{2014} ' + body.author;
      }
      xhr.send();
    } else {
      excerpt.innerText = 'Oops! Database is empty.';
    }
  };
  xhr.send();
}
