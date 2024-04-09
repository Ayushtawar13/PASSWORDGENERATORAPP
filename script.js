const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generatorButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const stringSymbols='~`!@#$%^&*()_-+=<>?/\][';
let password = "";
let passwordLength=10;
let checkCount=0;
// set strength color to grey

handleSlider();
setIndicator("#ccc");


// set passwordLength 
// handleSlider ka kam changes ko ui pr reflectkrvana

function handleSlider()
{
    if(passwordLength < 4)
    {
        inputSlider.value=4;
    }
    else
    {    
        inputSlider.value=passwordLength;
        lengthDisplay.innerText=passwordLength;
    }
}

// circle-color :-- ka color change krna  

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow=  `0 0 12px 1px  ${color}`;
    //shadow 
}

// random integer 

function getRndInteger(min ,max)
{
   return Math.floor( Math.random() *(max-min))+min
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65,91));
}

function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97,123));
}

function generateSymbol()
{
    const randNum=getRndInteger(0,stringSymbols.length);
    return stringSymbols.charAt(randNum);
}

// strength calculation formula 

function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hasSymbol=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNumber=true;
    if(symbolsCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower &&(hasNumber || hasSymbol) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if( (hasLower || hasUpper) && (hasNumber|| hasSymbol) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

// generate huye password ko clipboard me copy krvavna

async function copyContent()
{
    try{
        // ye method promise return krta hai 
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e)
    {
        copyMsg.innerText="Failed";
    }

    // to make copy vala span visible
    
    copyMsg.classList.add("active");

    setTimeout(copyMSg => {
        copyMsg.classList.remove("active");
    },2000); 

}

// Shuffling the password

function shufflePassword(array)
{
    // Fisher yates method
    console.log(array);
    for(let i=array.length-1; i>0; i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    let str="";
    array.forEach((el)=>(str+=el));
    console.log(str);
    return str;
}


// functions to handle the checkboxes
 
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


// slider ki value change krne ke liye

inputSlider.addEventListener('input',(e)=>
{ 
    passwordLength=e.target.value;
    handleSlider();
})

// copy button se password copy krnre ke liye

copyBtn.addEventListener('click',()=>
{
 if(passwordDisplay.value)
 copyContent();   
})

// password generate krne ke liye

generateBtn.addEventListener('click',()=>
{
    //none of the checkbbox is selected
    if(checkCount == 0)
        return;

    if(passwordLength < 4)
    {
        passwordLength=4;
        handleSlider();
    }

    // lets start journey to find new password
    console.log("Starting the Journey");
    // remove old password
    password="";

    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
   
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
   
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i=0; i<funcArr.length; i++)
    {
        password += funcArr[i]();
    }
    console.log("compulsory done");
    // remaining Addtion

    for(let i=0; i<passwordLength-funcArr.length; i++)
    {
        let randIndex=getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
        console.log(password);
    }
    console.log("remaining done");
    // shufflePassword

    password=shufflePassword(Array.from(password));
    console.log(password);
    console.log("shuffling done");
    // show in ui 
    passwordDisplay.value = password;
    console.log("ui done");
    // calculation of strength 
    calcStrength();
})