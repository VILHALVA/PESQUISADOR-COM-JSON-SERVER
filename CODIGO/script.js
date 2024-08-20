const searchWrapper = document.querySelector(".search");
const inputBox = searchWrapper.querySelector("input");
const sugestBox = searchWrapper.querySelector(".list");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink;

async function fetchSuggestions() {
  try {
    const response = await fetch('http://localhost:3000/searches');
    const data = await response.json();
    return data.map(item => item.query); 
  } catch (error) {
    console.error('Erro ao buscar as sugestões:', error);
    return [];
  }
}

inputBox.onkeyup = async (e) => {
  let userData = e.target.value;
  let emptyArray = [];

  if (e.key === 'Enter') {
    if (userData) {
      window.open(`https://www.google.com/search?q=${userData}`, '_blank');
    }
  }

  if (userData) {
    icon.onclick = () => {
      webLink = `https://www.google.com/search?q=${userData}`;
      linkTag.setAttribute("href", webLink);
      linkTag.click();
      saveSearch(userData);
    }

    const suggestions = await fetchSuggestions();
    emptyArray = suggestions.filter(data => data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()));

    emptyArray = emptyArray.map(data => `<li>${data}</li>`);

    searchWrapper.classList.add("active");
    showSuggestions(emptyArray);

    let allList = sugestBox.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
      allList[i].setAttribute("onclick", "select(this)");
    }

    if (e.key === 'Escape') {
      searchWrapper.classList.remove("active");
    }
  } 
  else {
    searchWrapper.classList.remove("active");
  }
};

function select(element) {
  let selectData = element.textContent;
  inputBox.value = selectData;

  icon.onclick = () => {
    webLink = `https://www.google.com/search?q=${selectData}`;
    linkTag.setAttribute("href", webLink);
    linkTag.click();
    saveSearch(selectData);
  }

  searchWrapper.classList.remove("active");
}

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    userValue = inputBox.value;
    listData = `<li>${userValue}</li>`;
  } 
  else {
    listData = list.join('');
  }
  sugestBox.innerHTML = listData;
}

async function saveSearch(query) {
  try {
    const existingSearches = await fetchSuggestions();
    if (!existingSearches.includes(query)) {
      const response = await fetch('http://localhost:3000/searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      console.log('Pesquisa salva:', data);
    } 
    else {
      console.log('A pesquisa já existe, não será salva novamente.');
    }
  } catch (error) {
    console.error('Erro ao salvar a pesquisa:', error);
  }
}
