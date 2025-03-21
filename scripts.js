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

  // Add event listeners for increment and decrement buttons
  document.querySelector("#dt-increment").addEventListener("click", () => {
    dtPillElement.textContent = (
      parseInt(dtPillElement.textContent) + 1
    ).toString();
    updateTotal();
    updateDrugInPocketDisplay();
  });

  document.querySelector("#dt-decrement").addEventListener("click", () => {
    const currentAmount = parseInt(dtPillElement.textContent);
    if (currentAmount > 1) {
      dtPillElement.textContent = (currentAmount - 1).toString();
      updateTotal();
      updateDrugInPocketDisplay();
    }
  });

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
