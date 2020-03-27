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

    addItemlist: function(newInputs) {
      if (newInputs.type === "inc") {
        dom.incomeListDOM.insertAdjacentHTML(
          "beforeend",
          `<div class="item clearfix" id="income-0">
          <div class="item__description">${newInputs.description}</div>
          <div class="right clearfix">
            <div class="item__value">+ ${newInputs.value}</div>
            <div class="item__delete">
              <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
              </button>
            </div>
          </div>
        </div>`
        );
      } else if (newInputs.type === "exp") {
        dom.expenseListDOM.insertAdjacentHTML(
          "beforeend",
          `<div class="item clearfix" id="expense-0">
          <div class="item__description">${newInputs.description}</div>
          <div class="right clearfix">
            <div class="item__value">- ${newInputs.value}</div>
            <div class="item__percentage">21%</div>
            <div class="item__delete">
              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
          </div>
        </div>`
        );
      }
    }
  };
})();

// Budget model
const budgetController = (() => {
  const financialData = {
    income: 0,
    expense: 0,
    budget: 0,
    expensePercentage: -1
  };

  function calcurateBudget() {
    financialData.budget = financialData.income - financialData.expense;
  }

  function calcuratePercentage() {
    financialData.expensePercentage =
      (financialData.expense / financialData.income) * 100;
  }

  function updateFinancialData(newInputs) {
    if (newInputs.type === "inc") {
      financialData.income += newInputs.value;
    } else if (newInputs.type === "exp") {
      financialData.expense += newInputs.value;
    }
    calcurateBudget();
    calcuratePercentage();
  }

  return {
    calcurateBudget: function(newInputs) {
      updateFinancialData(newInputs);
      return financialData;
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
    const budget = budgetController.calcurateBudget(newInputs);
    uiController.displayBudget(budget);
    // Update item list
    uiController.addItemlist(newInputs);
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
