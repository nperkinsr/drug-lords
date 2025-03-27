function closeModal() {
  document.getElementById("instructions").style.display = "none";
}

/////////////////////////////////////////////////////
//////////        MAP FOR MOBILE        /////////////
/////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const mapSection = document.getElementById("map");
  const buttonEndDay = document.querySelector(
    "#button-map-mobile .button-tablet"
  );
  const mapOverlay = document.createElement("div");

  mapOverlay.id = "dark-overlay";
  document.body.appendChild(mapOverlay);

  buttonEndDay.addEventListener("click", function (event) {
    event.preventDefault();
    mapSection.classList.add("map-fullscreen");
    mapSection.style.display = "flex"; // Show map
    mapOverlay.style.display = "block"; // Show overlay
  });

  mapOverlay.addEventListener("click", function () {
    mapSection.classList.remove("map-fullscreen");
    mapSection.style.display = "none"; // Hide map
    mapOverlay.style.display = "none"; // Hide overlay
  });
});

/////////////////////////////////////////////////////
//////////        DRUG ACTIONS         /////////////
/////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const drugTransactionContainer = document.querySelector(
    ".drug-transaction-container"
  );
  const buyButton = drugTransactionContainer.querySelector(".dt-buy-button");
  const sellButton = drugTransactionContainer.querySelector(".dt-sell-button");
  const overlay = document.querySelector(".dark-overlay");
  const moneyDisplay = document.querySelector(".money-in-hands span");
  let moneyInHand = parseInt(moneyDisplay.textContent); // MONEY IN HAND DECLARED GLOBALLY
  let drugInPocketElement = null; // I'll assign a value later

  const dtTotalElement = drugTransactionContainer.querySelector(".dt-total");
  const dtPillElement = drugTransactionContainer.querySelector("#dt-pill");
  const dtPriceElement = drugTransactionContainer.querySelector(".dt-price");
  const dtYouHaveElement =
    drugTransactionContainer.querySelector(".dt-you-have");

  const coinSound = new Audio("sounds/coins.mp3");

  function playSound() {
    coinSound.currentTime = 0;
    coinSound.play();
  }

  const hideTransactionContainer = (delay = 0) => {
    setTimeout(() => {
      drugTransactionContainer.classList.add("hidden");
      overlay.classList.remove("active");
    }, delay);
  };

  const updateTotal = () => {
    const price = parseInt(dtPriceElement.textContent);
    const amount = parseInt(dtPillElement.textContent);
    const total = price * amount;

    dtTotalElement.textContent = total.toString();

    // Dynamically fetch the updated money-in-hands value
    const updatedMoneyInHands = parseInt(
      document.querySelector(".money-in-hands span").textContent
    );

    // Update buy button state based on the updated money-in-hands value
    if (total > updatedMoneyInHands) {
      buyButton.disabled = true; // Disable the button if not enough money in hands
    } else {
      buyButton.disabled = false; // Enable the button if enough money in hands
    }
  };

  const updateDrugInPocketDisplay = () => {
    const currentInPocket = parseInt(drugInPocketElement.textContent);

    if (currentInPocket === 0) {
      dtYouHaveElement.innerHTML = "You don't have any in your pocket";
    } else {
      dtYouHaveElement.innerHTML = `You have <b>${currentInPocket}</b> in your pocket`;
    }

    // Update color for drugs with 1 or more in pocket
    const drugInPocketContainer = drugInPocketElement.closest(".drugInPocket");
    if (currentInPocket >= 1) {
      drugInPocketContainer.style.color = "#ff6289";
      sellButton.disabled = false;
    } else {
      drugInPocketContainer.style.color = "";
      sellButton.disabled = true;
    }

    // Check if dt-pill exceeds drugInPocketNumber
    const pillAmount = parseInt(dtPillElement.textContent);
    if (pillAmount > currentInPocket) {
      sellButton.disabled = true;
    }
  };

  // Add event listeners to all .drugAction buttons
  document.querySelectorAll(".drugAction").forEach((button) => {
    button.addEventListener("click", (event) => {
      const singleCardBody = event.target.closest(".singleCardContainer");

      // GETTING THE DRUG DETAILS
      const drugImage = singleCardBody.querySelector(".icon img").src;
      const drugName = singleCardBody
        .querySelector(".drugName")
        .textContent.trim();
      const drugPrice = singleCardBody
        .querySelector(".drugPrice span")
        .textContent.trim();
      drugInPocketElement = singleCardBody.querySelector(".drugInPocketNumber");

      // UPDATES ON THE INTERFACE
      drugTransactionContainer.querySelector(".dt-icon img").src = drugImage;
      drugTransactionContainer.querySelector(".dt-drug-name").textContent =
        drugName;
      dtPriceElement.textContent = drugPrice;
      dtTotalElement.textContent = drugPrice;
      dtPillElement.textContent = "1"; // Reset count when opening
      updateTotal();
      updateDrugInPocketDisplay();

      // SHOWING THE TRANSACTION CONTAINER
      drugTransactionContainer.classList.remove("hidden");
      overlay.classList.add("active");
    });
  });

  let intervalId = null; // To store the interval ID for clearing later

  // So when we click the pill buttons we don't have to click a bunch of times
  const startAdjustingPill = (adjustmentFunction) => {
    adjustmentFunction(); // Perform the adjustment immediately
    intervalId = setInterval(adjustmentFunction, 200); // Repeat every 200ms
  };

  const stopAdjustingPill = () => {
    clearInterval(intervalId); // Stop the interval
    intervalId = null;
  };

  const incrementPill = () => {
    dtPillElement.textContent = (
      parseInt(dtPillElement.textContent) + 1
    ).toString();
    updateTotal();
    updateDrugInPocketDisplay();
  };

  const decrementPill = () => {
    const currentAmount = parseInt(dtPillElement.textContent);
    if (currentAmount > 1) {
      dtPillElement.textContent = (currentAmount - 1).toString();
      updateTotal();
      updateDrugInPocketDisplay();
    }
  };

  // Add event listeners for increment and decrement buttons
  const incrementButton = document.querySelector("#dt-increment");
  const decrementButton = document.querySelector("#dt-decrement");

  incrementButton.addEventListener("mousedown", () => {
    startAdjustingPill(incrementPill);
  });

  decrementButton.addEventListener("mousedown", () => {
    startAdjustingPill(decrementPill);
  });

  // Stop adjusting when the mouse button is released
  document.addEventListener("mouseup", stopAdjustingPill);
  document.addEventListener("mouseleave", stopAdjustingPill);

  // For touch devices
  incrementButton.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent accidental clicks
    startAdjustingPill(incrementPill);
  });

  decrementButton.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent accidental clicks
    startAdjustingPill(decrementPill);
  });

  document.addEventListener("touchend", stopAdjustingPill);
  document.addEventListener("touchcancel", stopAdjustingPill);

  if (buyButton && sellButton) {
    buyButton.addEventListener("click", () => {
      const total = parseInt(dtTotalElement.textContent); // Total cost of the drugs
      const amountToBuy = parseInt(dtPillElement.textContent); // Number of drugs to buy

      // Dynamically fetch the updated money-in-hands value
      const updatedMoneyInHands = parseInt(
        document.querySelector(".money-in-hands span").textContent
      );

      if (total <= updatedMoneyInHands) {
        // Proceed with the purchase if the user has enough money in hands
        moneyInHand = updatedMoneyInHands - total; // Deduct the total cost from money in hands
        moneyDisplay.textContent = moneyInHand; // Update the money display
        drugInPocketElement.textContent =
          parseInt(drugInPocketElement.textContent) + amountToBuy; // Update the number of drugs in pocket
        playSound(); // Play the purchase sound
        hideTransactionContainer(400); // Hide the transaction container
        updateDrugInPocketDisplay(); // Update the drug display
      } else {
        // This should never happen if the button is properly disabled
        console.error("Purchase attempted with insufficient funds.");
      }
    });

    sellButton.addEventListener("click", () => {
      const amountToSell = parseInt(dtPillElement.textContent); // Number of drugs to sell
      const currentInPocket = parseInt(drugInPocketElement.textContent); // Current drugs in pocket

      if (amountToSell <= currentInPocket) {
        const price = parseInt(dtPriceElement.textContent); // Price per drug
        moneyInHand += price * amountToSell; // Add the total sale amount to money in hands
        moneyDisplay.textContent = moneyInHand; // Update the money display
        drugInPocketElement.textContent = currentInPocket - amountToSell; // Update the number of drugs in pocket
        playSound(); // Play the sale sound
        hideTransactionContainer(400); // Hide the transaction container
        updateDrugInPocketDisplay(); // Update the drug display
      }
    });
  }
});

// This is the GoBack button to close the drug actions... I had to redesign the whole thing :(
document.querySelector(".goback").addEventListener("click", () => {
  const drugTransactionContainer = document.querySelector(
    ".drug-transaction-container"
  );
  const overlay = document.querySelector(".dark-overlay");

  drugTransactionContainer.classList.add("hidden");
  overlay.classList.remove("active");
});

/////////////////////////////////////////////////////
//////////         DRUG PRICES          /////////////
/////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  // Selectors
  const dayOfWeekElement = document.querySelector(".day-of-week");
  const dayOfMonthElement = document.querySelector(".day-of-month");
  const neighbourhoodNameElement = document.querySelector(
    ".neighbourhood-name"
  );

  // Days of the week in order
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  let currentDayIndex = 0; // Start at MON (index 0)
  let currentDayOfMonth = 1; // Start at day 1

  // Drug price ranges... CAPS MATTER
  const drugPriceRanges = {
    CANNABIS: {
      regular: [100, 300],
      lowRange: [
        [60, 99],
        [301, 350],
      ],
    },
    COCAINE: {
      regular: [80, 170],
      lowRange: [
        [65, 79],
        [171, 200],
      ],
    },
    HEROIN: {
      regular: [150, 350],
      lowRange: [
        [130, 149],
        [351, 400],
      ],
    },
    MDMA: {
      regular: [20, 50],
      lowRange: [
        [15, 19],
        [51, 80],
      ],
    },
    LSD: {
      regular: [25, 45],
      lowRange: [
        [18, 24],
        [46, 80],
      ],
    },
    FENTANYL: {
      regular: [150, 440],
      lowRange: [
        [120, 149],
        [441, 550],
      ],
    },
    OXYCODONE: {
      regular: [25, 95],
      lowRange: [
        [18, 24],
        [96, 180],
      ],
    },
    KETAMINE: {
      regular: [90, 150],
      lowRange: [
        [70, 89],
        [151, 200],
      ],
    },
    ADDERALL: {
      regular: [10, 40],
      lowRange: [
        [6, 9],
        [41, 70],
      ],
    },
  };

  // Function to generate a random price for a drug
  function getRandomPrice(drugName) {
    const ranges = drugPriceRanges[drugName];
    const randomChance = Math.random(); // Random number between 0 and 1

    if (randomChance < 0.9) {
      // 90% chance: Regular price range
      const [min, max] = ranges.regular;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      // 10% chance: Low range
      const isLowRange = Math.random() < 0.5; // 50% chance for low or high range
      const [lowMin, lowMax] = isLowRange
        ? ranges.lowRange[0]
        : ranges.lowRange[1];
      // This is called TERNARY OPERATOR, shorthand of if...else: condition ? valueIfTrue : valueIfFalse;
      return Math.floor(Math.random() * (lowMax - lowMin + 1)) + lowMin;
    }
  }

  // Function to update all drug prices
  function updateDrugPrices() {
    document.querySelectorAll(".singleCardContainer").forEach((card) => {
      const drugName = card.querySelector(".drugName").textContent.trim();
      const priceElement = card.querySelector(".drugPrice span");

      if (drugPriceRanges[drugName]) {
        const newPrice = getRandomPrice(drugName);
        priceElement.textContent = newPrice; // Update the price in the DOM
      }
    });
  }

  // Function to update the day on the calendar thingy
  function updateDay() {
    // Update the day of the week
    currentDayIndex = (currentDayIndex + 1) % daysOfWeek.length; // This to loop back to MON after SUN
    dayOfWeekElement.innerHTML = daysOfWeek[currentDayIndex];

    // Update the day of the month
    currentDayOfMonth += 1;
    dayOfMonthElement.innerHTML = currentDayOfMonth;
  }

  // All map buttons
  document.querySelectorAll(".map-button").forEach((button) => {
    button.addEventListener("click", () => {
      // Update the neighbourhood name
      const neighbourhoodName = button.getAttribute("data-name");
      neighbourhoodNameElement.innerHTML = neighbourhoodName;

      updateDrugPrices();
      updateDay();
    });
  });

  // Initialize prices on page load
  updateDrugPrices();
});

/////////////////////////////////////////////////////
//////////        BUTTON SOUNDS         /////////////
/////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const buttonClickSound = new Audio("sounds/buttonClick.mp3");

  function playButtonClickSound() {
    buttonClickSound.currentTime = 0; // Reset the sound to the beginning
    buttonClickSound.play();
  }

  // All the thingies that I want to have the same sound... may add more
  const clickableElements = [
    ...document.querySelectorAll(".map-button"), // All links with .map-button
    ...document.querySelectorAll(".bank-button"), // All links with .bank-button
    ...document.querySelectorAll(".drugAction"), // All buttons with .drugAction
    document.querySelector(".close-btn"), // The button with .close-btn
    document.querySelector(".goback"), // The button with .goback
  ];

  clickableElements.forEach((element) => {
    if (element) {
      element.addEventListener("click", playButtonClickSound);
    }
  });
});

/////////////////////////////////////////////////////
//////////        BANK ACTIONS         /////////////
/////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  //To run only after the HTML is fully available
  // Selectors
  const bankTransactionContainer = document.querySelector(
    ".bank-transaction-container"
  );
  const bankButton = document.querySelector(".bank-button");
  const gobackBankButton = document.querySelector(".goback-bank");
  const overlay = document.querySelector(".dark-overlay"); // Reuse the .dark-overlay

  // Show the bank modal and overlay when the .bank-button is clicked
  if (bankButton) {
    bankButton.addEventListener("click", () => {
      bankTransactionContainer.classList.remove("hidden"); // Show the modal
      overlay.classList.add("active"); // Show the overlay
    });
  }

  // Hide the bank modal and overlay when the .goback-bank button is clicked
  if (gobackBankButton) {
    gobackBankButton.addEventListener("click", () => {
      bankTransactionContainer.classList.add("hidden"); // Hide the modal
      overlay.classList.remove("active"); // Hide the overlay
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Selectors | ANYTHING BT REFERS TO THE MODAL
  const balanceInBankElement = document.querySelector(".balanceInBank"); // This is the -$700 within the modal
  const moneyInHandsElement = document.querySelector(".money-in-hands span"); // The money in hands: $700
  const moneyInBankElement = document.querySelector(".money-in-bank span"); // The $700 in the original UI
  const depositButton = document.querySelector(".bt-deposit"); // Deposit button in modal
  const withdrawButton = document.querySelector(".bt-withdraw"); // Withdraw button in modal
  const gobackBankButton = document.querySelector(".goback-bank"); // The X to close the modal
  const amountInput = document.querySelector("#bt-amount"); // The input field with the 'Enter amount' placeholder
  const bankBalanceDisplay = document.querySelector(".bt-balance-display"); //It contains the balanceInBank and has highlight style
  const moneyInBankDisplay = document.querySelector(".money-in-bank"); //Money in bank in original UI with highlight style
  const loanInfoElement = document.querySelector(".bt-loan-info"); // Paragraph inside modal explaining loans
  const buttonClickSound = new Audio("sounds/buttonClick.mp3"); // Clicking sound for all buttons
  const errorSound = new Audio("sounds/error.mp3"); // Error sound for wrong amount in deposit or withdrawals
  const MAX_BANK_LOAN = 1000; // Const that never change can be written in uppercase and underscores (apparently)

  //BUTTON CLICK SOUND
  function playButtonClickSound() {
    buttonClickSound.currentTime = 0; // Reset the sound to the beginning in case of button spammers
    buttonClickSound.play();
  }

  // ERROR SOUND
  function playErrorSound() {
    errorSound.currentTime = 0; // For button spammers
    errorSound.play();
  }

  // Function to format the balance with a dollar sign and handle negative values
  function formatBalance(amount) {
    // Check if the amount is negative
    return amount < 0
      ? `-$${Math.abs(amount)}` // If negative: Convert to positive and add a "-" before "$"
      : `$${amount}`; // If positive: Just add "$" in front of the amount

    // `${}` is template literal syntax, allowing us to insert variables into a string.
  }

  // Explanation of how the function works:
  // - If the amount is negative (e.g., -50), I use 'Math.abs(amount)' to remove the negative sign
  // - Then, I manually add '-' in front of the '$' to display '-$50'
  // - If the amount is positive (e.g., 100), simply return '$100' as is

  // LOTS OF COMMENTS BECAUSE THIS SHIT IS HARD

  //  'amount': The amount of money the player wants to deposit or withdraw
  // 'isDeposit': A boolean (true = deposit, false = withdraw)
  function updateBalances(amount, isDeposit) {
    let balanceInBank = parseInt(
      balanceInBankElement.textContent.replace(/[^0-9-]/g, "") // Removes everything except numbers and the minus sign
    ); // Current bank balance
    let moneyInHands = parseInt(
      moneyInHandsElement.textContent.replace(/[^0-9]/g, "") // DO NOT allow negative value for money in hand
    ); // Current money in hands

    // CASE 1: Depositing Money into the Bank
    if (isDeposit) {
      if (amount > 0 && amount <= moneyInHands) {
        balanceInBank += amount;
        moneyInHands -= amount;
      } else {
        // User tries to deposit money they don't have
        playErrorSound();
        loanInfoElement.textContent = `Ah yes, the classic "deposit money I don't have" strategy. A bold choice. Unfortunately, this bank operates in reality, not wishful thinking.`;
        return;
      }
      // CASE 2: Withdraw money which can create loan
    } else {
      const totalLoan = Math.abs(balanceInBank);
      if (amount > 0 && totalLoan + amount <= MAX_BANK_LOAN) {
        balanceInBank -= amount;
        moneyInHands += amount;
      } else {
        // Error: The player is trying to borrow more than allowed
        playErrorSound();
        loanInfoElement.textContent = `Remember, we can only loan you up to $1000. We've lent you $${totalLoan} already. Do you also need us to lend you a calculator?`;
        return;
      }
    }

    // Updating the effing DOM
    balanceInBankElement.textContent = formatBalance(balanceInBank);
    moneyInHandsElement.textContent = moneyInHands; // No formatBalance cause money in hands always positive
    moneyInBankElement.textContent = formatBalance(balanceInBank);

    // Redeclare the global moneyInHand variable cause else everything goes to shit
    moneyInHand = moneyInHands;

    // Remove the .highlight class if the balance is 0 or more
    if (balanceInBank >= 0) {
      bankBalanceDisplay.classList.remove("highlight");
      moneyInBankDisplay.classList.remove("highlight");
    } else {
      bankBalanceDisplay.classList.add("highlight");
      moneyInBankDisplay.classList.add("highlight");
    }

    // Reset the loan info text to the default message
    loanInfoElement.textContent =
      'At Lend-A-Lot, we can lend you up to $1000, no questions asked. But pay soon, or we\'ll send our "friendly" collectors for a chat.';
  }

  // Event listener for deposit button
  if (depositButton) {
    depositButton.addEventListener("click", () => {
      playButtonClickSound();
      const amount = parseInt(amountInput.value);
      updateBalances(amount, true); // Deposit
      amountInput.value = ""; // Clear the input field
    });
  }

  // Event listener for withdraw button
  if (withdrawButton) {
    withdrawButton.addEventListener("click", () => {
      playButtonClickSound();
      const amount = parseInt(amountInput.value);
      updateBalances(amount, false); // Withdraw
      amountInput.value = ""; // Clear the input field
    });
  }

  // Event listener for goback-bank button
  if (gobackBankButton) {
    gobackBankButton.addEventListener("click", () => {
      playButtonClickSound();
      document
        .querySelector(".bank-transaction-container")
        .classList.add("hidden"); // Hide the modal
      document.querySelector(".dark-overlay").classList.remove("active"); // Hide the overlay
    });
  }

  // Event listener for the input field to remove the placeholder on focus
  if (amountInput) {
    amountInput.addEventListener("focus", () => {
      amountInput.placeholder = ""; // Clear the placeholder
    });

    amountInput.addEventListener("blur", () => {
      amountInput.placeholder = "Enter amount"; // Restore the placeholder on blur
    });
  }
});
