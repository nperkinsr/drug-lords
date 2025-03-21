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
    dtTotalElement.style.color = total > moneyInHand ? "red" : "inherit";
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
      dtPillElement.textContent = "1"; // Reset count when opening? or maybe not?
      updateTotal();

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
  });

  document.querySelector("#dt-decrement").addEventListener("click", () => {
    const currentAmount = parseInt(dtPillElement.textContent);
    if (currentAmount > 1) {
      dtPillElement.textContent = (currentAmount - 1).toString();
      updateTotal();
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
      } else {
        dtTotalElement.style.color = "red"; // TEMPORARY UNTIL I COME UP WITH A BETTER IDEA
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
