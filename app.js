// View module
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

  // Exposed
  return {
    dom,

    displayBudget: function(args) {
      dom.budgeValueDOM.textContent = args.budget;
      dom.incomeValueDOM.textContent = args.income;
      dom.expenseValueDOM.textContent = args.expense;
      dom.expensePercentageDOM.textContent = args.expensePercentage;
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

    addItemlist: function(newItem) {
      if (newItem.type === "inc") {
        dom.incomeListDOM.insertAdjacentHTML(
          "beforeend",
          `<div class="item clearfix" id="income-${newItem.id}">
          <div class="item__description">${newItem.description}</div>
          <div class="right clearfix">
            <div class="item__value">+ ${newItem.value}</div>
            <div class="item__delete">
              <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
              </button>
            </div>
          </div>
        </div>`
        );
      } else if (newItem.type === "exp") {
        dom.expenseListDOM.insertAdjacentHTML(
          "beforeend",
          `<div class="item clearfix" id="expense-${newItem.id}">
          <div class="item__description">${newItem.description}</div>
          <div class="right clearfix">
            <div class="item__value">- ${newItem.value}</div>
            <div class="item__percentage">21%</div>
            <div class="item__delete">
              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
          </div>
        </div>`
        );
      }
    },

    deleteItem: function(target) {
      target.parentNode.removeChild(target);
    }
  };
})();

// Budget model
const budgetController = (() => {
  const Item = function(args) {
    this.id = lastID + 1;
    this.type = args.type;
    this.value = args.value;
    this.description = args.description;
    updateLastID();
  };

  let lastID = 0;
  function updateLastID() {
    lastID++;
  }

  const booking = [];
  const financialData = {
    budget: 0,
    income: 0,
    expense: 0,
    expensePercentage: -1
  };

  function calcurateFinancialData() {
    let income = 0;
    let expense = 0;
    booking.forEach(item => {
      item.type === "inc" ? (income += item.value) : (expense += item.value);
    });

    financialData.income = income;
    financialData.expense = expense;
    financialData.budget = income - expense;
    financialData.expensePercentage = (expense / income) * 100;
  }

  return {
    addToBooking: function(newInputs) {
      const newItem = new Item(newInputs);
      booking.push(newItem);
      return newItem;
    },

    removeFromBooking: function(id) {
      const index = booking.findIndex(item => {
        return item.id === parseInt(id);
      });
      booking.splice(index, 1);
    },

    getBudget: function() {
      calcurateFinancialData();
      return financialData;
    },

    test: {
      booking,
      financialData
    }
  };
})();

// Controller
const controller = ((uiController, budgetController) => {
  const dom = uiController.dom;

  // When Check button is clicked
  dom.addButtonDOM.addEventListener("click", () => {
    const newInputs = {
      type: dom.addTypeDOM.value,
      description: dom.addDescriptionDOM.value,
      value: parseFloat(dom.addValueDOM.value)
    };
    // Calcurate and update budget
    const newItem = budgetController.addToBooking(newInputs);
    const budget = budgetController.getBudget();
    uiController.displayBudget(budget);
    // Update item list
    uiController.addItemlist(newItem);
  });

  // When delete button is clicked
  dom.incomeListDOM.addEventListener("click", e => {
    if (e.target.className === "ion-ios-close-outline") {
      // Calcurate budget and display them
      const targetNode = e.target.parentNode.parentNode.parentNode.parentNode;
      budgetController.removeFromBooking(targetNode.id.split("-")[1]);
      const budget = budgetController.getBudget();
      uiController.displayBudget(budget);
      // Removing the target item from UI
      uiController.deleteItem(targetNode);
    }
  });

  return {
    // Initial display arragement
    init: function() {
      console.log("Initialized");
      uiController.displayBudget({
        budget: 0,
        income: 0,
        expense: 0,
        expensePercentage: "---"
      });
      uiController.displayMonth();
    }
  };
})(uiController, budgetController);

// Initialing app
controller.init();
