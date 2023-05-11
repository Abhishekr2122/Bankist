'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementDates:["21 August 2012","25 April 2013","10 June 2022","4 April 2013","8 March 2017","1 March 2023","5 March 2023","07 March 2023"],
  interestRate: 1.2, // %
  pin: 1111,
  currency : "INR",
  locale: "en-IN",
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementDates:["23 August 2015","25 April 2018","12 June 2014","14 April 2011","18 March 2019","22 March 2020","16 September 2012","12 February 2023"],
  interestRate: 1.5,
  pin: 2222,
  currency: "EUR",
  locale: "en-GB",
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementDates:["20 August 2014","27 April 2011","15 June 2020","7 April 2007","8 March 2003","4 March 2005","11 September 2014","1 March 2023"],
  interestRate: 0.7,
  pin: 3333,
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  movementDates:["27 August 2015","29 April 2011","10 June 2022","4 April 2013","8 March 2017","12 March 2019","16 September 2015","2 April 2014"],
  interestRate: 1,
  pin: 4444,
  currency: "PTE",
  locale: "pt-PT",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');


const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const updateUI = function(currentobject){
// displaying movements
displayMovements(currentobject);

// displaying totalbalance
totaldisplayValue(currentobject);

//  displaying summary
calcDisplaySummary(currentobject);
}
// containerMovements.innerHTML = " ";
// login

btnLogin.addEventListener("click",userLogIn);

let currentAccount;

function userLogIn(e){
  //  As soon as we click on button in a form it gets submitted or reloded to  prevent it from submiting we use preventDefault() method
    e.preventDefault();
    // console.log("hellothere");


    // formating dates using internalization date API
    currentAccount = accounts.find(function(acc){
      return acc.username === inputLoginUsername.value;
    });
    const now = new Date();
    const options  = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year:"numeric",
      
    };
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(now);
    


    // const day = `${now.getDate()}`.padStart(2,0);
    // const month = `${now.getMonth()+1}`.padStart(2,0);
    // const year = now.getFullYear();
    // const time = now.getHours();
    // const hour  = now.getHours();
    // const min = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`;

    if(currentAccount?.pin === Number(inputLoginPin.value)){
      // display ui and welcome message
      labelWelcome.textContent = `Welcome back , ${currentAccount.owner.split(" ")[0]}`;
      containerApp.style.opacity = 100;
      
     //  clear input data
      inputLoginUsername.value = '';
      inputLoginPin.value='';
      inputLoginPin.blur();


      updateUI(currentAccount);
    };
    
}



// computing username
const addUsername = function(arr){
  arr.forEach(function(currentElem){
    let userid  = currentElem.owner.toLowerCase().split(" ").map(function(elem){
      return elem[0];
    }).join("");
    currentElem.username = userid;
    console.log(currentElem);
  })
}
addUsername(accounts);


// displaying total balance using reduce method
const totaldisplayValue = function(acc){
  acc.balance = acc.movements.reduce(function(cdvalue,value){
    let sum = cdvalue+value;
    return sum;
  },0);
  // console.log(sum);
  labelBalance.textContent = new Intl.NumberFormat(acc.locale,{style:"currency",currency:acc.currency}).format(acc.balance);
} ;




// displaying total deposit and total withdrwal by using map(),filter(),reduce() method together
const calcDisplaySummary = function(account){
  const depositIncome = account.movements.filter(function(dvalue){
    return dvalue>0;
  }).reduce(function(acc,cvalue){
    let sum = acc+cvalue;
    return sum;
  },0);
  // Internationalizing the amount depending on the country currency
  labelSumIn.textContent = new Intl.NumberFormat(account.locale,{style:"currency",currency:account.currency}).format(depositIncome);

  
 const withdrawalIncome = Math.abs(account.movements.filter(function(wvalue){
  return wvalue<0;
 }).reduce(function(acc,cvalue){
  let sum = acc+cvalue;
  return sum;
 },0));
 //  labelSumOut.textContent = `${Math.abs(withdrawalIncome)}€`;
// we can also remove the minus sign by using Math.abs() in the backticks 
// Internationalizing the amount depending on the country currency 
 labelSumOut.textContent = new Intl.NumberFormat(account.locale,{style:"currency",currency:account.currency}).format(withdrawalIncome);


 const interest = account.movements.filter(function(mov){
  return mov>0;
 }).map(function(ivalue){
  return ivalue * (account.interestRate)/100;
 }).filter(function(fvalue){
  return fvalue>=1;
 }).reduce(function(acc,rvalue){
  let sum = acc+rvalue;
  return sum;
 },0);
 console.log(interest);
// Internationalizing the amount depending on the country currency
labelSumInterest.textContent =new Intl.NumberFormat(account.locale,{style:"currency",currency: account.currency}).format(interest);

};


const formatingDates = function(date,locale){
  const calcDaysPassed = function(date1,date2){
    return  Math.floor(Math.abs(date2-date1)/(1000 * 60 * 60 *24));
  }
  const daysPassed = calcDaysPassed(new Date(),date);
  
  
  if(daysPassed === 0){
    return "Today";
  }

  if(daysPassed === 1){
    return "yesterday";
  }

  if(daysPassed<= 7){
    return `${daysPassed} days ago`;
  }


    // const day = `${date.getDate()}`.padStart(2,0);
    // const month = `${date.getMonth()+1}`.padStart(2,0);
    // const year = date.getFullYear();
    
    // formating dates by using internationalization dates API
    return new Intl.DateTimeFormat(locale).format(date);
  

}



// inserting the balance movements by using insertAdjacentHTML() method
console.log(containerMovements);
const displayMovements = function(acc,sort=false){
  containerMovements.innerHTML = " ";

  const movs = sort ? acc.movements.slice().sort(function(a,b){
    return a-b;
  }) : acc.movements;
 movs.forEach(function(mov,i){
    // const type = "withdrawal"; 
    let type  = "";
    if(mov>0){
      type = "deposit";
    }
    else{
      type="withdrawal";
    }
    
     let dates = new Date(acc.movementDates[i]); 
    let displayDate = formatingDates(dates,acc.locale);

    // internationalizing the amount value
    let formatedMov = new Intl.NumberFormat(acc.locale,{style:"currency",currency: acc.currency}).format(mov);
  
  const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatedMov}</div>
  </div>`;
  containerMovements.insertAdjacentHTML("afterbegin",html);
  });
};
// note: - here insertAdjacentHTML method is used not insertAdjacentELEMENT() because here we are creating a html template literal and adding it
// we are not creating a html element by using createElement() method and then adding the element.
// console.log(containerMovements.innerHTML);


// transfers

btnTransfer.addEventListener("click",function(e){
   e.preventDefault();
  // console.log("abhishek");
  let amount = Number(inputTransferAmount.value);
  // let transferDate = new Date();
  // let accTranferDate = `${transferDate.getDate()}/${transferDate.getMonth+1}/${transferDate.getFullYear()}`;
  let receiverAccount = accounts.find(function(raccount){
       return raccount.username === inputTransferTo.value;
  });
 

  inputTransferTo.value = '';
  inputTransferAmount.value ='';
  inputTransferAmount.blur();
  // account checks
   
  if(amount>0 && currentAccount.balance>=amount && receiverAccount && receiverAccount?.username!==currentAccount.username){
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // adding transfer dates
    currentAccount.movementDates.push(new Date());
    receiverAccount.movementDates.push(new Date());

    updateUI(currentAccount);
  } 
});


// loan 
btnLoan.addEventListener("click",function(e){
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  // let loanDate = new Date();
  // let loanTransferDate = new Date(`${loanDate.getDate()}/${loanDate.getMonth() +1}/${loanDate.getFullYear()}`);
  if(amount>0 && currentAccount.movements.some(function(lvalue){
    return lvalue>amount*0.1;
  })){
    
    // adding the loan amount
    currentAccount.movements.push(amount);
    
    // adding loan date
    currentAccount.movementDates.push(new Date());

    // update ui
    updateUI(currentAccount);
  }
  
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  

})


// closing account
btnClose.addEventListener("click",function(e){
  e.preventDefault();
  console.log("account deleted");
  if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    let index = accounts.findIndex(function(cindex){
      return cindex.username === currentAccount.username;
    });
    // console.log(index);
    
    // delete account
    accounts.splice(index,1);

    // hide ui
    containerApp.style.opacity = 0;
      
  }
 
  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputClosePin.blur();

})

let sorted = false;
btnSort.addEventListener("click",function(e){
  console.log("hello there");
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;
})



