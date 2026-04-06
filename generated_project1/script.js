// Select DOM elements
const currentOperandTextElement = document.getElementById('current-operand');
const previousOperandTextElement = document.getElementById('previous-operand');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');
const historyToggleBtn = document.getElementById('history-toggle-btn');

// Select the grid container for event delegation
const buttonsGrid = document.querySelector('.buttons-grid');

// Initialize state variables
let isDarkMode = false;
let isHistoryVisible = false;

// Calculator Class Definition
class Calculator {
  constructor(currentOperandTextElement, previousOperandTextElement) {
    this.currentOperandTextElement = currentOperandTextElement;
    this.previousOperandTextElement = previousOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    if (this.currentOperand === '0') return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === '') this.currentOperand = '0';
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = prev / current;
        break;
      default:
        return;
    }

    // Construct equation string for history
    const equation = `${prev} ${this.operation} ${current}`;

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';

    // Add to history using the specific function signature
    addToHistory(equation, computation);
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

// Initialize calculator instance
const calculator = new Calculator(currentOperandTextElement, previousOperandTextElement);

// History Management Function
function addToHistory(equation, result) {
  const li = document.createElement('li');
  li.innerText = `${equation} = ${result}`;
  historyList.prepend(li);
}

// Theme Toggle Function
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
}

// Event Listener for Calculator Buttons (Delegation)
buttonsGrid.addEventListener('click', (e) => {
  const button = e.target.closest('.btn');
  if (!button) return;

  // Handle specific actions
  if (button.dataset.action === 'equals') {
    calculator.compute();
  } else if (button.dataset.action === 'clear') {
    calculator.clear();
  } else if (button.dataset.action === 'delete') {
    calculator.delete();
  } 
  // Handle operations
  else if (button.dataset.operation) {
    calculator.chooseOperation(button.innerText);
  } 
  // Handle numbers
  else {
    calculator.appendNumber(button.innerText);
  }

  calculator.updateDisplay();
});

// Event Listener for Keyboard Support
window.addEventListener('keydown', (e) => {
  if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
    calculator.appendNumber(e.key);
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    calculator.chooseOperation(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault(); // Prevent default behavior for Enter key
    calculator.compute();
  } else if (e.key === 'Backspace') {
    calculator.delete();
  } else if (e.key === 'Escape') {
    calculator.clear();
  }
  calculator.updateDisplay();
});

// Event Listeners for UI State (Theme & History)
themeToggle.addEventListener('click', toggleTheme);

historyToggleBtn.addEventListener('click', () => {
  isHistoryVisible = !isHistoryVisible;
  const historyPanel = document.getElementById('history-panel');
  if (isHistoryVisible) {
    historyPanel.classList.add('visible');
  } else {
    historyPanel.classList.remove('visible');
  }
});
