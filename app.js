/*################################## this section is for adding budget ##################################*/
// get localStorage values
// it takes 'balance' 'expenses' 'budget'
const getLocalStorageValues = (item) => {
    if (localStorage.getItem(item)) {
        return localStorage.getItem(item);
    } else {
        return false;
    }
}

/* show localStorage values on the page and if there's
// no localStorage values it will run the setLocalStorageValues to
// set new values */
const showlocalStorageValuesToBudgetSection = () => {
    let budget = document.getElementById('budget');
    let expenses = document.getElementById('expenses');
    let balance = document.getElementById('balance');
    for (var i = 0; i < 2; i++) {
        getLocalStorageValues('budget') ? (budget.innerText = getLocalStorageValues('budget') + ' $') : setLocalStorageValues('budget', 0);
        getLocalStorageValues('expenses') ? (expenses.innerText = '- ' + getLocalStorageValues('expenses') + ' $') : setLocalStorageValues('expenses', 0);
        getLocalStorageValues('balance') ? (balance.innerText = getLocalStorageValues('balance') + ' $') : setLocalStorageValues('balance', 0);
    }
}
// add values to localStorage
const setLocalStorageValues = (item, value) => {
    localStorage.setItem(item, value);
}
showlocalStorageValuesToBudgetSection();

const start = () => {
    var budgetValue = document.getElementById('budgetInput').value;
    if (budgetValue > 0) {
        // set the budget to the new value
        setLocalStorageValues('budget', budgetValue);
        let budget = getLocalStorageValues('budget'); // it has the new budget value
        // get expense value
        let expenses = calculateExpenses();
        // calculate the balance and update it's value in localStorage
        setLocalStorageValues('balance', budget - expenses);
        showlocalStorageValuesToBudgetSection();
        clearInput('budgetInput');
        colorsEdit();
    } else {
        setError('ERROR! value cannot be empty or negative or 0');
        clearInput('budgetInput');
    }
}

// clear the input field
const clearInput = (inputId) => {
    document.getElementById(inputId).value = '';
}

const calculate = (newbudgetValue) => {
    // set the budget to the new value
    setLocalStorageValues('budget', newbudgetValue);
    let budget = getLocalStorageValues('budget'); // it has the new budget value
    // get expense value
    let expenses = calculateExpenses();
    // calculate the balance and update it's value in localStorage
    setLocalStorageValues('balance', budget - expenses);
    showlocalStorageValuesToBudgetSection();
}


/*################################## this section is for adding expences ##################################*/
var expenseBox = document.querySelector('.show-expenses .child');

const setExpensesToLocatStorage = () => {
    if (getLocalStorageValues('expensesTable')) {
        return true;
    } else {
        setLocalStorageValues('expensesTable', JSON.stringify(
            []
        ));
    }
}
setExpensesToLocatStorage();

const addExpense = () => {
    let expenseName = document.getElementById('expenseNameInput').value;
    let expensePrice = document.getElementById('expensePriceInput').value;
    let expenseId = getExpenseNewId();
    let expenseTable = [];
    if (checkForLetters(expenseName) && expensePrice > 0 && expenseName.trim() != "") {
        JSON.parse(localStorage.getItem('expensesTable')).map((elem) => {
            expenseTable.push(elem);
        });
        expenseTable.push(
            {
                'id': expenseId,
                'name': expenseName,
                'price': expensePrice
            },
        );
        clearInput('expenseNameInput');
        clearInput('expensePriceInput');
        setLocalStorageValues('expensesTable', JSON.stringify(expenseTable));
        pushNewExpenseToPage(expenseId, expenseName, expensePrice);
        localStorage.setItem('expenses', calculateExpenses());
        setLocalStorageValues('balance', getLocalStorageValues('budget') - calculateExpenses());
        showlocalStorageValuesToBudgetSection();
        colorsEdit();
    } else {
        expenseName.innerText = '';
        expensePrice.innerText = '';
        setError('ERROR! values cannot be empty, negative or 0 . name accepts only alphabets');
    }
}


// check if there is only letters in the given string
const checkForLetters = (inputValue) => {
    var letters = /^[A-Aa-z' ']+$/;
    if (inputValue.toLowerCase().match(letters)) {
        return true;
    } else {
        return false;
    }
}

const deleteExpense = (expenseId) => {
    let originTable = JSON.parse(localStorage.getItem('expensesTable'));
    let newExpenseTable = [];
    let div = document.getElementById(expenseId);
    originTable.map(elem => {
        if (elem.id == expenseId) {
            console.log(elem.name + ' is deleted!');
        } else {
            newExpenseTable.push(elem);
        }
    });
    setLocalStorageValues('expensesTable', JSON.stringify(newExpenseTable));
    calculateExpenses();
    localStorage.setItem('expenses', calculateExpenses());
    setLocalStorageValues('balance', getLocalStorageValues('budget') - calculateExpenses());
    showlocalStorageValuesToBudgetSection();
    div.remove();
    colorsEdit();
    document.getElementById('expensesCount').innerText = JSON.parse(localStorage.getItem('expensesTable')).length;
}

const calculateExpenses = () => {
    let table = JSON.parse(localStorage.getItem('expensesTable'));
    let expensesValue = 0;
    table.map(elem => {
        expensesValue += parseInt(elem.price);
    })
    return expensesValue;
}

const pushNewExpenseToPage = (id, name, price) => {
    let container = document.querySelector('.show-expenses');
    let div = document.createElement('div');
    div.classList.add('child');
    div.id = id;
    div.innerHTML = `
        <p id="expenceName" style="color: #303030;">${name}</p>
        <p id="expensePrice" style="color: #e31919;">-${price}$</p>
        <div class="menu">
            </button>
            <button onclick="deleteExpense('${id}')">
                <svg fill="#e31919" width="20px" height="20px" viewBox="0 0 16 16">
                    <path
                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                </svg>
            </button>
        </div>
        `
    container.appendChild(div);
    document.getElementById('expensesCount').innerText = JSON.parse(localStorage.getItem('expensesTable')).length;
}

const getExpenseNewId = () => {
    let i = (JSON.parse(localStorage.getItem('expensesTable')).length) + 1;
    return 'expense' + i;
}

const pushExpensesFromLoaclStorage = () => {
    let container = document.querySelector('.show-expenses');
    JSON.parse(localStorage.getItem('expensesTable')).forEach(elem => {
        let div = document.createElement('div');
        div.classList.add('child');
        div.id = elem.id;
        div.innerHTML = `
            <p id="expenceName" style="color: #303030;">${elem.name}</p>
            <p id="expensePrice" style="color: #e31919;">-${elem.price}$</p>
            <div class="menu">
                <button onclick="deleteExpense('${elem.id}')">
                    <svg fill="#e31919" width="20px" height="20px" viewBox="0 0 16 16">
                        <path
                            d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                </button>
            </div>
            `
        container.appendChild(div);
    });
    document.getElementById('expensesCount').innerText = JSON.parse(localStorage.getItem('expensesTable')).length;
}
pushExpensesFromLoaclStorage();

const colorsEdit = () => {
    // edit the color when the values changes
    if (parseInt(document.getElementById('balance').innerText) < 0) {
        document.getElementById('balance').style.color = '#e31919';
    } else {
        document.getElementById('balance').style.color = '#288728';
    }
}
colorsEdit();

const reset = () => {
    localStorage.clear();
    window.location.reload(false);
}

// error message
const setError = (errorMessage) => {
    document.querySelector('.error-message').style.transform = "translateY(0%)";
    document.getElementById('error-message-value').innerText = errorMessage;
    setTimeout(() => {
        document.querySelector('.error-message').style.transform = "translateY(-150%)";
    }, 3000);
}