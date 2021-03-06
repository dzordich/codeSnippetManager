let results
let searchTerm
let cleanSearch
var ifOwn = ''
var dropDownChoice

const snip0Button = document.querySelector('#snip0Button')
const snip1Button = document.querySelector('#snip1Button')
const snip2Button = document.querySelector('#snip2Button')
const snip0 = document.querySelector('#snip0')
const snip1 = document.querySelector('#snip1')
const snip2 = document.querySelector('#snip2')
const searchAttr = document.querySelector('#searchTerm')
dropDownChoice = searchAttr.value
const Prism = require('./prism.js')
const searchButton = document.querySelector('#searchButton')
const searchBox = document.querySelector('#searchBox')
const searchInput = document.querySelector('#searchInput')
const resultArea = document.querySelector('#searchResults')
const pageContent = document.querySelector('.pagecontent')

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
if (document.querySelector('#loggedIn')) {
    var copyUser = document.querySelector('#loggedIn').dataset['username']
    var copyUsername = document.querySelector('#loggedIn').dataset['userstring']
}

// Displays search results
function displayResults(key) {
    const resultsDiv = document.createElement('div')
    resultsDiv.classList.add('snippet')
    resultsDiv.innerHTML = `
    <div id="snippet${ key.pk}" class="card bg-transparent shadow-sm">
            <p class="card-header snippet-title"><span class="font-weight-bold">${key.title} </span></p>
            <div class="card-body">
            <p class="card-text">${key.user_username} | Added on: ${key.date} | Copied <span id="timesCopied${key.pk}">${key.num_times_copied}</span> times</p>
            <p class="card-text text-secondary">${key.description} </p>
    <div class='code-toolbar'>	
        <pre class='line-numbers language-${key.language.toLowerCase()}'><code class='language-${key.language.toLowerCase()}'>${escapeHtml(key.code)}</code></pre>
    </div>
`
    console.log('key.user:', key.user)
    console.log('copyUser:', copyUser)
    if (document.querySelector('#loggedIn')) {
        resultsDiv.innerHTML += `<div class="alert-primary" id="copySuccess${key.pk}"></div><div class="alert-danger" id="deleteSuccess${key.pk}"></div>
<button class="copyButton btn btn-primary mx-auto snippetCopyButton${key.pk}" data-pk="${key.pk}" data-title="${key.title}" data-language="${key.language}" data-description="${key.description}" data-times-copied="${key.num_times_copied}" data-code="${encodeURI(key.code)}">Add to your Library</button>`
        if (key.user == copyUser) {
            resultsDiv.innerHTML += `<button class="deleteButton btn btn-danger snippetDeleteButton${key.pk}" data-pk="${key.pk}">Delete</button>`
        }
    }
    resultsDiv.innerHTML += `</div></div>`
    return resultsDiv
}

// Main search execution
searchButton.addEventListener('click', function () {
    searchBox.querySelector('input').focus()
    searchTerm = searchBox.querySelector('input').value
    cleanSearch = encodeURIComponent(searchTerm)
    results = document.querySelector('#searchResults')
    dropDownChoice = searchAttr.value
    if (dropDownChoice === 'own') {
        ifOwn = copyUsername
    } else if (dropDownChoice === 'snippet') {
        ifOwn = ''
    }
    fetch(`https://snipmanager.herokuapp.com/${searchAttr.value}/?search=${cleanSearch}%20${ifOwn}`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            results.innerHTML = ''
            pageContent.style.display = 'none'
            for (let key of data) {
                results.appendChild(displayResults(key))
            }
            Prism.highlightAllUnder(results)
            ifOwn = ''
        })
})
document.querySelector("#searchInput").addEventListener("keyup", event => {
    if (event.key !== "Enter") return;
    document.querySelector("#searchButton").click()
    event.preventDefault()
});

searchInput.addEventListener('input', function () {
    if (!searchInput.value) {
        resultArea.innerHTML = ''
        pageContent.style.display = 'block'
        return;
    }
    document.querySelector('#searchButton').click()
})



let editorLangSelect = document.querySelector("#id_language");
if (editorLangSelect) {
    console.log('poop')
    editorLangSelect.addEventListener("change", function () {
        console.log('woooooooooooooooooooo')
        code_codemirror.setOption("mode", editorLangSelect.value.toLowerCase())
    })
}



let copyTitle
let copyLanguage
let copyCode
let copyOriginal
let copyDescription
let copyDict
let timesCopied

const copyButton = document.querySelector('#copyButton')

document.querySelector('#searchResults').addEventListener('click', function (event) {
    if (event.target && event.target.matches('.copyButton')) {
        copyTitle = event.target.dataset['title']
        copyLanguage = event.target.dataset['language']
        copyCode = decodeURI(event.target.dataset['code'])
        copyOriginal = event.target.dataset['pk']
        copyDescription = event.target.dataset['description']
        timesCopied = (parseInt(event.target.dataset['timesCopied']) + 1)


        copyDict = {
            "language": copyLanguage,
            "title": copyTitle,
            "code": copyCode,
            "user": copyUser,
            "original": copyOriginal,
            "description": copyDescription,
            "date": getDate()
        }
        // console.log(copyDict)
        console.log(JSON.stringify(copyDict))
        fetch('https://snipmanager.herokuapp.com/snippets/', {
            method: 'POST',
            body: JSON.stringify(copyDict),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
        let copySuccess = '#copySuccess' + copyOriginal
        document.querySelector(copySuccess).innerHTML = '<p>You made a copy to your profile!</p>'
        document.querySelector(`#timesCopied${copyOriginal}`).innerHTML = `${timesCopied}`
    }
})

let cardNumber

if (document.querySelector('.snippetWindow')) {
    document.querySelector('.snippetWindow').addEventListener('click', function (event) {
        if (event.target && event.target.matches('.copyButton')) {
            console.log('blah')
            copyTitle = event.target.dataset['title']
            copyLanguage = event.target.dataset['language']
            copyCode = decodeURI(event.target.dataset['code'])
            copyOriginal = event.target.dataset['pk']
            copyDescription = event.target.dataset['description']
            cardNumber = event.target.dataset['cardNumber']

            copyDict = {
                "language": copyLanguage,
                "title": copyTitle,
                "code": copyCode,
                "user": copyUser,
                "original": copyOriginal,
                "description": copyDescription,
                "date": getDate()
            }
            // console.log(copyDict)
            console.log(JSON.stringify(copyDict))
            fetch('https://snipmanager.herokuapp.com/snippets/', {
                method: 'POST',
                body: JSON.stringify(copyDict),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(response => console.log('Success:', JSON.stringify(response)))
                .catch(error => console.error('Error:', error));

            document.querySelector(`.copyCardSuccess${cardNumber}`).innerHTML = '<p class="alert-primary">You made a copy to your profile!</p>'

        }
    })
}

function getDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
}
if (snip0Button) {
    snip0Button.addEventListener('click', function () {
        snip0.classList.toggle('hideSnip')
        snip0Button.classList.toggle('bg-transparent')
        if (!snip2Button.classList.contains('bg-transparent')) {
            snip2Button.classList.add('bg-transparent')
        }
        if (!snip1Button.classList.contains('bg-transparent')) {
            snip1Button.classList.add('bg-transparent')
        }
        if (!snip2.classList.contains('hideSnip')) {
            snip2.classList.add('hideSnip')
        }
        if (!snip1.classList.contains('hideSnip')) {
            snip1.classList.add('hideSnip')
        }
    })
}
if (snip1Button) {
    snip1Button.addEventListener('click', function () {
        snip1.classList.toggle('hideSnip')
        snip1Button.classList.toggle('bg-transparent')
        if (!snip0Button.classList.contains('bg-transparent')) {
            snip0Button.classList.add('bg-transparent')
        }
        if (!snip2Button.classList.contains('bg-transparent')) {
            snip2Button.classList.add('bg-transparent')
        }
        if (!snip0.classList.contains('hideSnip')) {
            snip0.classList.add('hideSnip')
        }
        if (!snip2.classList.contains('hideSnip')) {
            snip2.classList.add('hideSnip')
        }
    })
}
if (snip2Button) {
    snip2Button.addEventListener('click', function () {
        snip2.classList.toggle('hideSnip')
        snip2Button.classList.toggle('bg-transparent')
        if (!snip0Button.classList.contains('bg-transparent')) {
            snip0Button.classList.add('bg-transparent')
        }
        if (!snip1Button.classList.contains('bg-transparent')) {
            snip1Button.classList.add('bg-transparent')
        }
        if (!snip0.classList.contains('hideSnip')) {
            snip0.classList.add('hideSnip')
        }
        if (!snip1.classList.contains('hideSnip')) {
            snip1.classList.add('hideSnip')
        }
    })
}
let toDelete

document.querySelector('#searchResults').addEventListener('click', function (event) {
    if (event.target && event.target.matches('.deleteButton')) {
        toDelete = event.target.dataset['pk']

        fetch(`https://snipmanager.herokuapp.com/delete/${toDelete}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error))
        document.querySelector(`#snippet${toDelete}`).innerHTML = "<p class='alert-danger'>Your Snippet has been deleted!</p>"
        document.querySelector(`.snippetCopyButton${toDelete}`).style.display = 'none'
        document.querySelector(`.snippetDeleteButton${toDelete}`).style.display = 'none'
    }
})


if (document.querySelector('#snippetHome')) {
    let snippetList = document.querySelectorAll('#snippetHome')
    for (snippet of snippetList) {
        snippet.addEventListener('click', function (event) {
            if (event.target && event.target.matches('.deleteButton')) {
                console.log('ugggh')
                toDelete = event.target.dataset['pk']
                console.log(toDelete)

                fetch(`https://snipmanager.herokuapp.com/delete/${toDelete}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                })
                document.querySelector(`.snippet${toDelete}`).innerHTML = "<p class='alert-danger'>Your Snippet has been deleted!</p>"
            }
        })
    }
}

// if (document.querySelector('.snippetWindow')) {
//     document.addEventListener("DOMContentLoaded", function () {
//         document.querySelector('#recentSnipButton0').innerHTML = ''
//     }
// }
