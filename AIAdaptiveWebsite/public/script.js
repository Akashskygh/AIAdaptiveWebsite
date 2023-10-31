// Add Quick Link functionality
let addLinkBtn = document.querySelector('.add-link-btn');
let quickLinksContainer = document.getElementById('quick-links');
let modifiedCss = '';

// To load HTML file
function loadHTML(data) {
      let bodyElement = document.getElementsByTagName("body")[0];
      bodyElement.innerHTML = data;
}

// To load CSS file
function loadCSS() {
  // Removing existing style
  let link = document.querySelector('link[href="styles.css"][rel="stylesheet"]');
  if (link) { link.remove(); }

  let styleToRemove = document.querySelector('style[type="text/css"]');
  if (styleToRemove) { styleToRemove.remove(); }

  // Navigate to head
  let head = document.getElementsByTagName('head')[0];

  if (modifiedCss) {
    let css = modifiedCss;
    let style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';

    if (style.styleSheet) {
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  } else {
    // Creating link element
    let style = document.createElement('link');
    style.href = 'styles.css';
    style.type = 'text/css';
    style.rel = 'stylesheet';
    head.append(style);
  }
}

addLinkBtn.addEventListener('click', () => {
  let linkTitle = prompt('Enter the title for the quick link:');
  let linkURL = prompt('Enter the URL for the quick link:');

  if (linkTitle && linkURL) {
    let link = document.createElement('a');
    link.href = linkURL;
    link.textContent = linkTitle;

    let removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      link.remove();
      removeBtn.remove();
    });

    let quickLinkItem = document.createElement('div');
    quickLinkItem.appendChild(link);
    quickLinkItem.appendChild(removeBtn);
    quickLinksContainer.appendChild(quickLinkItem);
  }
});

// Overlay and assistance functionality
let optionOverlay = document.getElementById('option-overlay');
let visibilityBtn = document.getElementById('visibility-btn');
let additionalBtn = document.getElementById('additional-btn');
let languageBtn = document.getElementById('language-barrier-btn');
let yesBtn = document.getElementById('yes-btn');
let noBtn = document.getElementById('no-btn');
let responseContainer = document.getElementById('response-container');
let responseText = document.getElementById('response-text');
let selectedOption = null; // Track the selected assistive option
let timeout;

function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(showOptionOverlay, 10000);
}

function hideOptionOverlay() {
  optionOverlay.style.display = 'none';
  resetTimer();
}

function showOptionOverlay() {
  optionOverlay.style.display = 'flex';
  enableYesNoButtons(); 
}

// Function to enable Yes and No buttons
function enableYesNoButtons() {
  let yesNoButtons = document.querySelector('.yes-no-buttons');
  yesNoButtons.style.display = 'flex';
}
// Function to disable Yes and No buttons
function disableYesNoButtons() {
  let yesNoButtons = document.querySelector('.yes-no-buttons');
  yesNoButtons.style.display = 'none';
}

visibilityBtn.addEventListener('click', () => {
  selectedOption = 'Lack of Visibility';
  enableYesNoButtons();
});

additionalBtn.addEventListener('click', () => {
  selectedOption = 'I am looking for...';
  enableYesNoButtons();
});

languageBtn.addEventListener('click', () => {
  selectedOption = 'Language Barrier';
  enableYesNoButtons();
});

yesBtn.addEventListener('click', () => {
  if (selectedOption) {
    // Handle the "Yes" button action based on the selected assistive option
    switch (selectedOption) {
      case 'Lack of Visibility':
        let visibilityCodeData = {
          htmlCode: document.documentElement.outerHTML,
          cssCode: '',
          jsCode: "console.log('test');",
        };

        // Send the data to the backend for processing with ChatGPT
        fetch('styles.css')
          .then(response => response.text())
          .then(data => {
            visibilityCodeData.cssCode = data;
            fetch('/improve-visibility', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(visibilityCodeData),
            })
              .then(response => response.json())
              .then(data => {
                let modifiedCode = data.modifiedCode;
                modifiedCss = data.modifiedCode;
                displayModifiedCode(modifiedCode);
                loadCSS();
                hideOptionOverlay(); // Hide the option overlay after the option is clicked
              })
              .catch(error => {
                console.error('Error improving visibility:', error);
              });
          });
        console.log('Handling Lack of Visibility...');
        break;
      case 'I am looking for...':
        let option = prompt('Enter the name of the option you are looking for: ');
        let optionCodeData = {
          htmlCode: document.documentElement.outerHTML,
          option: option, // Pass the searched option to the server
        };

        // Send the data to the backend for processing with ChatGPT
        fetch('index.html')
          .then(response => response.text())
          .then(data => {
            optionCodeData.htmlCode = data;
            fetch('/search-option', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(optionCodeData),
            })
              .then(response => response.json())
              .then(data => {
                let modifiedCode = data.modifiedCode;
                modifiedCss = data.modifiedCode;
                displayModifiedCode(modifiedCode);
                loadHTML(modifiedCode);
                hideOptionOverlay(); // Hide the option overlay after the option is clicked
              })
              .catch(error => {
                console.error('Error searching for option:', error);
              });
          });
        console.log('Handling I am looking for...');
        break;
        case 'Language Barrier':
        let languageCodeData = {
          htmlCode: document.documentElement.outerHTML,
        };

        // Send the data to the backend for processing with ChatGPT
        fetch('index.html')
          .then(response => response.text())
          .then(data => {
            languageCodeData.htmlCode = data;
            fetch('/language-barrier', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(languageCodeData),
            })
              .then(response => response.json())
              .then(data => {
                let modifiedCode = data.modifiedCode;
                modifiedCss = data.modifiedCode;
                displayModifiedCode(modifiedCode);
                loadHTML(modifiedCode);
                hideOptionOverlay(); // Hide the option overlay after the option is clicked
              })
              .catch(error => {
                console.error('Error resolving language barrier:', error);
              });
          });
        console.log('Handling Language Barrier');
        break;
      default:
        break;
    }

    selectedOption = null; // Reset selected option
    hideOptionOverlay();   // Hide the option overlay after an option is selected
    disableYesNoButtons(); // Hide the "Yes" and "No" buttons after an option is selected
  }
});

noBtn.addEventListener('click', () => {
  selectedOption = null; // Reset selected option
  hideOptionOverlay();   // Hide the option overlay if user selects "No"
  disableYesNoButtons(); // Hide the "Yes" and "No" buttons if user selects "No"
});

// Initialize the timer for the overlay
resetTimer();

function displayModifiedCode(code) {
  // Display the modified code in the response container
  responseContainer.style.display = 'block';
  responseText.textContent = code;
}

function displayChatGptResponse(response) {
  responseContainer.style.display = 'block';
  responseText.textContent = response;
}