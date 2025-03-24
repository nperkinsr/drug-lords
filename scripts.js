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

  mapOverlay.id = "map-overlay";
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
  // Selectors
  const drugTransactionContainer = document.querySelector(
    ".drug-transaction-container"
  );
  const buyButton = drugTransactionContainer.querySelector(".dt-buy-button");
  const sellButton = drugTransactionContainer.querySelector(".dt-sell-button");
  const overlay = document.querySelector(".map-overlay");
  const moneyDisplay = document.querySelector(".money-in-hands span");
  let moneyInHand = parseInt(moneyDisplay.textContent);
  let drugInPocketElement = null;

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

    // Update buy button state
    if (total > moneyInHand) {
      buyButton.disabled = true; // Disable the button
    } else {
      buyButton.disabled = false; // Enable the button
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
      drugInPocketContainer.style.color = "#ff6289"; // Apply color to all text
      sellButton.disabled = false; // Enable the sell button
    } else {
      drugInPocketContainer.style.color = ""; // Reset to default
      sellButton.disabled = true; // Disable the sell button
    }

    // Check if dt-pill exceeds drugInPocketNumber
    const pillAmount = parseInt(dtPillElement.textContent);
    if (pillAmount > currentInPocket) {
      sellButton.disabled = true; // Disable the sell button
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
  document.addEventListener("mouseleave", stopAdjustingPill); // In case the mouse leaves the button area

  // For touch devices, use touchstart and touchend
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
      const total = parseInt(dtTotalElement.textContent);
      const amountToBuy = parseInt(dtPillElement.textContent);

      if (total <= moneyInHand) {
        moneyInHand -= total;
        moneyDisplay.textContent = moneyInHand;
        drugInPocketElement.textContent =
          parseInt(drugInPocketElement.textContent) + amountToBuy;
        playSound();
        hideTransactionContainer(400);
        updateDrugInPocketDisplay();
      }
    });

    sellButton.addEventListener("click", () => {
      const amountToSell = parseInt(dtPillElement.textContent);
      const currentInPocket = parseInt(drugInPocketElement.textContent);
      if (amountToSell <= currentInPocket) {
        const price = parseInt(dtPriceElement.textContent);
        moneyInHand += price * amountToSell;
        moneyDisplay.textContent = moneyInHand;
        drugInPocketElement.textContent = currentInPocket - amountToSell;
        playSound();
        hideTransactionContainer(400);
        updateDrugInPocketDisplay();
      }
    });
  }
});

// This is the GoBack button to close the drug actions... I had to redesign the whole thing :(
document.querySelector(".goback").addEventListener("click", () => {
  const drugTransactionContainer = document.querySelector(
    ".drug-transaction-container"
  );
  const overlay = document.querySelector(".map-overlay");

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

  // Drug price ranges
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
