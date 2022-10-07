/* Calculator Logic */
const keys = document.querySelectorAll('.calculator-key');
const resultElement = document.getElementById('result');
const previousOpElement = document.getElementById('previous-op');

// a (op) b = result
let a = "", b= "", op = "";
// true = writing a / false = writing b
let writingFirstValue = true;

// after equal was pressed => del shouldn't work, if press number a = new number
// if press operation a = result and writingFirstValue = false
let afterEqualState = false;

function setResultElement() {
    console.log(a + op + b);
    let valueToShow = writingFirstValue ? a : (b != "" ? b : a);

    if(valueToShow == "") resultElement.innerHTML = "0";
    else resultElement.innerHTML = valueToShow;
}

function setPreviousOperation(reset=false) {
    if(a != "" && op != "" && !writingFirstValue) {
        previousOpElement.innerHTML = a + op;
    } else if(afterEqualState && a != "") {
        previousOpElement.innerHTML = "=" + a;
    } else {
        previousOpElement.innerHTML = "&nbsp";
    }
}

const operations = {
    '+': (a, b) => {return a + b},
    '-': (a, b) => {return a - b},
    '/': (a, b) => {return a / b},
    'x': (a, b) => {return a * b}
}

function resolveOperation() {
    if(isNaN(a) || isNaN(b) || !/^[\+-\/\x]$/.test(op)) return undefined

    return Math.round(operations[op](Number(a), Number(b))*100)/100;    
}

function numberClickEvent(number) {
    if(writingFirstValue) {
        if(a == "" && number == 0) return;

        if(afterEqualState) {
            if(number == 0) return;
            afterEqualState = false;
            a = number;
        } else {
            a += number;
        }
    } else {
        if(b == "" && number == 0) return;
        b += number;
    }
}

function operationKeyClickEvent(value) {
    if(writingFirstValue) {
        a = a == "" ? "0" : a;
        op = value;
        writingFirstValue = false;
    } else {
        if(b == "") op = value;
        else {
            // faz a operação, põe resultado no a e põe o operador
            let result = resolveOperation();
            a = result;
            op = value;
            b = "";
            afterEqualState = true;
        }
    }
}

const specialKeys = {
    'DEL': () => {
        writingFirstValue ?  a = a.slice(0, -1) : b = b.slice(0, -1);
    },
    'RESET': () => {
        a = "";
        b = "";
        op = "";
        writingFirstValue = true;
    },
    '=': () => {
        let result = resolveOperation();
        if(result != undefined) {
             a = result;
             op = ""
             b = ""
             writingFirstValue = true;
             afterEqualState = true;
        }
    }
}



keys.forEach((key) => {
    key.addEventListener('click', (event) => {
        if(key.classList.contains('calculator-number-key')) {
            numberClickEvent(key.innerHTML);
            setResultElement();
            setPreviousOperation();
        } else if(key.classList.contains('calculator-operation-key')){
            operationKeyClickEvent(key.innerHTML);
            setResultElement();
            setPreviousOperation();
        } else {
            specialKeys[key.innerHTML]();
            setResultElement();
            setPreviousOperation();
        }
    });
})



/* Theme changer */
let curTheme = 1
const thematicElements = document.querySelectorAll('.thematic');

function changeTheme(newTheme) {
    if(newTheme < 1 || newTheme > 3) throw 'Invalid Theme';
    thematicElements.forEach(element => {
        element.classList.remove('theme' + curTheme);
        element.classList.add('theme' + newTheme);
    })
    curTheme = newTheme;
}

const sliderDots = document.querySelectorAll('.slider-dot');
sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', (event) => {
        event.target.classList.add('active');
        changeTheme(index+1);
        sliderDots.forEach(dot => {
            if(dot != event.target) dot.classList.remove('active');
        })
    });
});