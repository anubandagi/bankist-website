'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", 
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2];

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

//global value
let currentUser;
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


//formating date

/////////////////////////

//first function

const displayMovements=function(acc,sort=false){

  containerMovements.innerHTML='';
  console.log(acc.movements);
  const movs=sort?acc.movements.slice().sort((a,b)=>a-b):acc.movements;
  console.log(movs);
  movs.map((mov,i)=>{
    const type=mov>0?'deposit':'withdrawal';
    const html=` 
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}</div>
  </div>`;

  containerMovements.insertAdjacentHTML('afterbegin',html);


  });

}



//function for total deposit,withdrwal and interest

const calDisplaySummery=function(acc)
{
  const income=acc.movements.filter((mov)=>mov>0).reduce((acc,cur)=>acc+cur);
  labelSumIn.textContent=`${income}€`;
  const withdrawal=acc.movements.filter((mov)=>mov<0).reduce((acc,cur)=>acc+cur,0);
  labelSumOut.textContent=`${Math.abs(withdrawal)}€`;
  const interest=acc.movements.filter((mov)=>mov>0).map((i)=>(i*acc.interestRate)/100).filter((i)=>{
    return i>=1;
  }).reduce((acc,cur)=>acc+cur,0);
  labelSumInterest.textContent=`${interest}€`;
}



//function for computing username

const userName=function(accounts)
{
         
  accounts.forEach(function(acc){
    acc.username=acc.owner.toLowerCase().split(' ').map((i)=>i[0]).join('');
  });
  
}

userName(accounts);
console.log(accounts);


//computing the total balance

const balance=function(acc){ 
acc.balance=acc.movements.reduce((acc,cur)=>acc+cur,0)
labelBalance.textContent=`${acc.balance}€`;

}

//update functions
const updating=function(acc)
{
displayMovements(acc);
calDisplaySummery(acc);
balance(acc);
};



//function for login
btnLogin.addEventListener("click",function(e){
 e.preventDefault();
  currentUser=accounts.find((acc)=>acc.username==inputLoginUsername.value);
  
  if(currentUser?.pin==Number(inputLoginPin.value))
  {
    labelWelcome.textContent=`Welcome ${currentUser.owner}`;
    // displaying the ui
  containerApp.style.opacity='100';
  //update ui
  updating(currentUser);
  }
  inputLoginPin.value=inputLoginUsername.value='';
  


});


//transfer amount function 

btnTransfer.addEventListener("click",function(e){
  e.preventDefault();
  const reciverAmount=Number(inputTransferAmount.value);
  const reciverAcc=accounts.find((acc)=>acc.username==inputTransferTo.value);
inputTransferAmount.value=inputTransferTo.value='';
if(reciverAmount>0 && reciverAcc && reciverAcc.username!==currentUser.username && currentUser.balance>=reciverAmount)
{
    
  currentUser.movements.push(-reciverAmount);
  reciverAcc.movements.push(reciverAmount);

}


//updating the ui
updating(currentUser);

});


//logOut function

btnClose.addEventListener("click",function(e)
{
  e.preventDefault();
  
 
  if(inputCloseUsername.value==currentUser.username && inputClosePin.value==Number(currentUser.pin))
  {

   
    const index=accounts.findIndex(acc=>acc.username==inputCloseUsername.value);
    accounts.splice(index,1);
    //close ui
    containerApp.style.opacity=0;
  }
});

//Requesting loan 
btnLoan.addEventListener("click",function(e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(amount>0 && currentUser.movements.some((mov)=>mov>=amount*0.1))
  {

        currentUser.movements.push(amount);

        //updating the ui

        updating(currentUser);
    
  }
  inputLoanAmount.value='';
});

let sorted=false;
//sorting of the movments
btnSort.addEventListener("click",function(e){
  e.preventDefault();
   displayMovements(currentUser,!sorted);
   sorted=!sorted;
});


let v=new Date();
console.log(v.toLocaleDateString('hi-IN',{
  weekday:'long',
}));

console.log(new Intl.DateTimeFormat('hi-IN',{
  weekday:'long',
}).format(v))



const stringReverse=function(a){
  const res=a.slice().split('').reverse().join('');
  return res;
}

console.log(stringReverse(12));
let a="hii";
