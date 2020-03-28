// ------------------ View module ----------------------
const uiController = (() => {
  // DOM
  const dom = {
    budgeValueDOM: document.querySelector(".budget__value"),
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

  function numberFormatter(number) {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY"
    }).format(number);
  }

  function percentageFormatter(divided, division) {
    if (division < 1) return "---";
    return `${Math.floor((divided / division) * 100)}%`;
  }

  // Exposed
  return {
    dom,

    displayBudget: function(args) {
      dom.budgeValueDOM.textContent = numberFormatter(
        args.income - args.expense
      );
      dom.incomeValueDOM.textContent = numberFormatter(args.income);
      dom.expenseValueDOM.textContent = numberFormatter(args.expense);
      dom.expensePercentageDOM.textContent = percentageFormatter(
        args.expense,
        args.income
      );
    },

    displayMonth: function() {
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

    displayItems: function(booking) {
      booking.forEach(item => {
        if (item.type === "inc") {
          dom.incomeListDOM.insertAdjacentHTML(
            "beforeend",
            `<div class="item clearfix" id="income-${item.id}">
          <div class="item__description">${item.description}</div>
          <div class="right clearfix">
            <div class="item__value">+ ${numberFormatter(item.value)}</div>
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
            dom.incomeValueDOM.textContent.replace("￥", "")
          );
          dom.expenseListDOM.insertAdjacentHTML(
            "beforeend",
            `<div class="item clearfix" id="expense-${item.id}">
          <div class="item__description">${item.description}</div>
          <div class="right clearfix">
            <div class="item__value">- ${numberFormatter(item.value)}</div>
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

    clearItems: function() {
      [dom.incomeListDOM, dom.expenseListDOM].forEach(element => {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
      });
    },

    inputColorChange: function() {
      console.log("inside");
      const targetfields = [
        dom.addTypeDOM,
        dom.addDescriptionDOM,
        dom.addValueDOM
      ];
      targetfields.forEach(target => {
        target.classList.toggle("red-focus");
      });
      dom.addButtonDOM.classList.toggle("red");
    }
  };
})();

// ---------------------- Budget model ------------------------
const budgetController = (() => {
  // Each items in booking
  const booking = [];
  const Item = function(args) {
    this.id = lastID + 1;
    this.type = args.type;
    this.value = parseFloat(args.value);
    this.description = args.description;
    updateLastID();
  };

  let lastID = 0;
  function updateLastID() {
    lastID++;
  }

  function calcurateFinancialData() {
    let income = 0;
    let expense = 0;

    booking.forEach(item => {
      item.type === "inc" ? (income += item.value) : (expense += item.value);
    });

    return {
      income: income,
      expense: expense
    };
  }

  return {
    addToBooking: function(newInputs) {
      const newItem = new Item(newInputs);
      booking.push(newItem);
    },

    removeFromBooking: function(id) {
      const index = booking.findIndex(item => {
        return item.id === parseInt(id);
      });
      booking.splice(index, 1);
    },

    getBudget: function() {
      const financialData = calcurateFinancialData();
      return financialData;
    },

    getBooking: function() {
      return booking;
    }
  };
})();

// ----------------- Controller -----------------------
const controller = ((uiController, budgetController) => {
  const dom = uiController.dom;

  // When Check button is clicked
  dom.addButtonDOM.addEventListener("click", () => {
    const newInputs = {
      type: dom.addTypeDOM.value,
      description: dom.addDescriptionDOM.value,
      value: dom.addValueDOM.value
    };
    // Calcurate and update budget
    budgetController.addToBooking(newInputs);
    const budget = budgetController.getBudget();
    uiController.displayBudget(budget);
    // Update item list
    const booking = budgetController.getBooking();
    uiController.clearItems();
    uiController.displayItems(booking);
  });

  function deleteListItem(e) {
    if (e.target.className === "ion-ios-close-outline") {
      // Calcurate budget and display them
      const targetNode = e.target.parentNode.parentNode.parentNode.parentNode;
      budgetController.removeFromBooking(targetNode.id.split("-")[1]);
      const budget = budgetController.getBudget();
      uiController.displayBudget(budget);
      // Update item list
      const booking = budgetController.getBooking();
      uiController.clearItems();
      uiController.displayItems(booking);
    }
  }
  // When delete button is clicked
  dom.incomeListDOM.addEventListener("click", e => deleteListItem(e));
  dom.expenseListDOM.addEventListener("click", e => deleteListItem(e));

  dom.addTypeDOM.addEventListener("change", () => {
    uiController.inputColorChange();
  });

  return {
    // Initial display arragement
    init: function() {
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
