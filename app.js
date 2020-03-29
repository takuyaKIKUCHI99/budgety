// ------------------ View module ----------------------
const uiController = (() => {
  // All DOM strings used in this app
  const dom = {
    budgetValueDOM: document.querySelector(".budget__value"),
    incomeValueDOM: document.querySelector(".budget__income--value"),
    expenseValueDOM: document.querySelector(".budget__expenses--value"),
    expensePercentageDOM: document.querySelector(
      ".budget__expenses--percentage"
    ),
    thisMonthDOM: document.querySelector(".budget__title--month"),
    addTypeDOM: document.querySelector(".add__type"),
    addDescriptionDOM: document.querySelector(".add__description"),
    addValueDOM: document.querySelector(".add__value"),
    addButtonDOM: document.querySelector(".add__btn"),
    incomeListDOM: document.querySelector(".income__list"),
    expenseListDOM: document.querySelector(".expenses__list")
  };

  // Formatting in JPY
  const moneyFormatter = number => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY"
    }).format(number);
  };

  // Formatting percentages
  const percentageFormatter = (divided, division) => {
    if (division < 1) return "---";
    return `${Math.floor((divided / division) * 100)}%`;
  };

  const clearItems = () => {
    [dom.incomeListDOM, dom.expenseListDOM].forEach(element => {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    });
  };

  return {
    getDOMstrings: () => dom,
    // Display financial data in top banner
    displayBudget: args => {
      dom.budgetValueDOM.textContent = moneyFormatter(
        args.income - args.expense
      );
      dom.incomeValueDOM.textContent = moneyFormatter(args.income);
      dom.expenseValueDOM.textContent = moneyFormatter(args.expense);
      dom.expensePercentageDOM.textContent = percentageFormatter(
        args.expense,
        args.income
      );
    },
    // Display current month in top banner
    displayMonth: () => {
      const today = new Date();
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      dom.thisMonthDOM.textContent = `${
        months[today.getMonth()]
      },  ${today.getFullYear()}`;
    },
    // Display each financial items
    displayItems: booking => {
      // Clearing financial items first
      clearItems();
      booking.forEach(item => {
        if (item.type === "inc") {
          dom.incomeListDOM.insertAdjacentHTML(
            "beforeend",
            `<div class="item clearfix" id="income-${item.id}">
          <div class="item__description">${item.description}</div>
          <div class="right clearfix">
            <div class="item__value">+ ${moneyFormatter(item.value)}</div>
            <div class="item__delete">
              <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
              </button>
            </div>
          </div>
        </div>`
          );
        } else if (item.type === "exp") {
          const income = parseInt(
            dom.incomeValueDOM.textContent.replace(/[￥,]/g, "")
          );
          dom.expenseListDOM.insertAdjacentHTML(
            "beforeend",
            `<div class="item clearfix" id="expense-${item.id}">
          <div class="item__description">${item.description}</div>
          <div class="right clearfix">
            <div class="item__value">- ${moneyFormatter(item.value)}</div>
            <div class="item__percentage">${percentageFormatter(
              item.value,
              income
            )}</div>
            <div class="item__delete">
              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
          </div>
        </div>`
          );
        }
      });
    },
    // Changing input color between income and expense
    inputColorChange: () => {
      const targetfields = [
        dom.addTypeDOM,
        dom.addDescriptionDOM,
        dom.addValueDOM
      ];
      targetfields.forEach(target => {
        target.classList.toggle("red-focus");
      });
      dom.addButtonDOM.classList.toggle("red");
    },

    // Get inputs values
    getInputs: () => {
      return {
        type: dom.addTypeDOM.value,
        description: dom.addDescriptionDOM.value,
        value: dom.addValueDOM.value
      };
    },

    clearInputs: () => {
      dom.addDescriptionDOM.value = "";
      dom.addValueDOM.value = "";
      dom.addTypeDOM.focus();
    }
  };
})();

// ---------------------- Budget model ------------------------
const budgetController = (() => {
  // Array for each Item
  const booking = [];
  let lastId = 0;

  // Creating new Item when input is submitted
  class Item {
    constructor(args, id) {
      this.id = id;
      this.type = args.type;
      this.value = parseFloat(args.value);
      this.description = args.description;
    }
  }

  // Returing total income and expense from items in booking
  const calcuratingTotals = () => {
    let income = 0;
    let expense = 0;

    booking.forEach(item => {
      item.type === "inc" ? (income += item.value) : (expense += item.value);
    });

    return {
      income: income,
      expense: expense
    };
  };

  return {
    // Adding new Item to booking
    addToBooking: newInputs => {
      const newItem = new Item(newInputs, lastId + 1);
      lastId++;
      booking.push(newItem);
    },

    // Removing Item from booking
    removeFromBooking: id => {
      const index = booking.findIndex(item => {
        return item.id === parseInt(id);
      });
      booking.splice(index, 1);
    },

    getTotals: () => calcuratingTotals(),

    getBooking: () => booking
  };
})();

// ----------------- Controller -----------------------
const controller = ((uiController, budgetController) => {
  // Getting DOM strings from UI controller
  const dom = uiController.getDOMstrings();

  // Event when Check button is clicked
  const addListItem = () => {
    // Getting values from DOM input
    const newInputs = uiController.getInputs();
    if (!newInputs.description || !newInputs.value) return;
    // Calcurate and update budget
    budgetController.addToBooking(newInputs);
    const budget = budgetController.getTotals();
    uiController.displayBudget(budget);
    // Update item list
    const booking = budgetController.getBooking();
    uiController.displayItems(booking);
    // Clearing input fields
    uiController.clearInputs();
  };

  const deleteListItem = e => {
    if (e.target.className === "ion-ios-close-outline") {
      // Calcurate budget and display them
      const targetNode = e.target.parentNode.parentNode.parentNode.parentNode;
      budgetController.removeFromBooking(targetNode.id.split("-")[1]);
      const budget = budgetController.getTotals();
      uiController.displayBudget(budget);
      // Update item list
      const booking = budgetController.getBooking();
      uiController.displayItems(booking);
    }
  };

  // Event listner
  // Add item
  dom.addButtonDOM.addEventListener("click", addListItem);
  window.addEventListener("keyup", e => {
    if (e.keyCode === 13) addListItem();
  });
  // Delete item
  dom.incomeListDOM.addEventListener("click", e => deleteListItem(e));
  dom.expenseListDOM.addEventListener("click", e => deleteListItem(e));
  // Changing color of inputs field for income and expense
  dom.addTypeDOM.addEventListener("change", () => {
    uiController.inputColorChange();
  });

  return {
    // Initial display arragement
    init: () => {
      console.log("Initialized");
      uiController.displayBudget({
        income: 0,
        expense: 0
      });
      uiController.displayMonth();
    }
  };
})(uiController, budgetController);

// Initialing app
controller.init();
