
// add text query box
function addTextBox() {

    console.log('Query box function called');

    // Create the main container for the query box and buttons
    const queryContainer = document.createElement('div');
    queryContainer.classList.add('query-container');

    // Create the textarea for entering queries
    const queryBox = document.createElement('textarea');
    queryBox.id = 'queryBox';
    queryBox.setAttribute('placeholder', 'Enter your query here...');
    queryBox.style.width = '100%';
    queryBox.style.height = '150px'; // Adjust height as needed
    queryBox.style.padding = '10px';
    queryBox.style.margin = '10px 0';
    queryBox.style.fontSize = '16px';
    queryBox.style.fontFamily = 'Arial, sans-serif';
    queryBox.style.boxSizing = 'border-box';
    queryBox.style.border = '1px solid #ddd';

    // container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    // 'Run Query' button
    const runQueryButton = document.createElement('button');
    runQueryButton.id = 'runQuery';
    runQueryButton.textContent = 'Run Query';

    // 'Clear' button
    const clearButton = document.createElement('button');
    clearButton.id = 'clearQuery';
    clearButton.textContent = 'Clear';

    // Append buttons to the container
    buttonContainer.appendChild(runQueryButton);
    buttonContainer.appendChild(clearButton);

    // Append the query box and button container to the query container
    queryContainer.appendChild(queryBox);
    queryContainer.appendChild(buttonContainer);

    // Find the position where you want to insert the query container and insert it
    const targetElement = document.querySelector('.yasqe'); 
    if (targetElement) {
        targetElement.parentNode.insertBefore(queryContainer, targetElement);
    } else {
        console.error("Target element '.yasqe' not found.");
    }


    var resultsContainer = document.createElement('div');
    resultsContainer.classList.add('result-container');

    const resultBox  = document.createElement('textarea');
    resultBox.id = 'resultBox';
    resultBox.setAttribute('placeholder', 'Enter your query here...');
    resultBox.style.width = '100%';
    resultBox.style.height = '50px'; // Adjust height as needed
    resultBox.style.padding = '10px';
    resultBox.style.margin = '10px 0';
    resultBox.style.fontSize = '16px';
    resultBox.style.fontFamily = 'Arial, sans-serif';
    resultBox.style.boxSizing = 'border-box';
    resultBox.style.border = '1px solid #ddd';


    resultsContainer.appendChild(resultBox);
    if (targetElement) {
        targetElement.parentNode.insertBefore(resultsContainer, targetElement);
    }
    else {
        console.error("Target element '.yasqe' not found.");
    }
}

//running query
function runQuery(query) {
    const resultBox = document.getElementById('resultBox');
        
    resultBox.textContent = 'Loading';
    resultBox.style.fontFamily = "Inter";
    
    let dotCount = 1;
    let increasing = true;

    const updateLoadingAnimation = function() {
        // Update dot count
        if (increasing) {
            dotCount++;
            if (dotCount >= 4) {
                increasing = false;
            }
        } else {
            dotCount--;
            if (dotCount <= 1) {
                increasing = true;
            }
        }
        
        resultBox.textContent = 'Loading' + '.'.repeat(dotCount);
    };

    const loadingAnimation = setInterval(updateLoadingAnimation, 500);

    fetch('http://127.0.0.1:8000/run-query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(loadingAnimation); // Stop the loading animation
        // resultBox.textContent = data;
        resultBox.textContent = ' ';
        console.log('Success:', data);
        var sparql_query = data['query'];
   
        var yasqe = yasgui.getTab().yasqe
        yasqe.setValue(sparql_query);
    })
    .catch((error) => {
        clearInterval(loadingAnimation); // Stop the loading animation
        resultBox.textContent = 'Error occurred'; // Display error message
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    tab = yasgui.getTab(0);
    tabId = tab.persistentJson.id;

    tabDiv = document.querySelector('#tab-' + tabId);

    // Change the tab name
    span = tabDiv.querySelector('span');
    span.textContent = 'Text Query';

    // Hide the close tab button
    closeTabDiv = document.querySelector('#tab-' + tabId + ' .closeTab');
    closeTabDiv.style.display = 'none';

    //adding custom text box
    addTextBox();

    //runnnig query
    document.getElementById('runQuery').addEventListener('click', function() {
        const query = document.getElementById('queryBox').value;
        runQuery(query);
    });


    var clearButton = document.getElementById('clearQuery');
    var queryBox = document.getElementById('queryBox');

    clearButton.addEventListener('click', function() {
        queryBox.value = '';
    });

});



