// View module
const uiController = (() => {
  // DOM
  const budgeValueDOM = document.querySelector(".budget__value");
  const incomeValueDOM = document.querySelector(".budget__income--value");
  const expenseValueDOM = document.querySelector(".budget__expenses--value");
  const expensePercentageDOM = document.querySelector(
    ".budget__expenses--percentage"
  );
  const thisMonth = document.querySelector(".budget__title--month");

  return {
    updateBadget: function(args) {
      budgeValueDOM.textContent = args.budget;
      incomeValueDOM.textContent = args.income;
      expenseValueDOM.textContent = args.expense;
      expensePercentageDOM.textContent = args.expensePercentage;
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
      thisMonth.textContent = `${
        months[today.getMonth()]
      },  ${today.getFullYear()}`;
    }
  };
})();

// Budget model
const budgetController = (() => {
  const data = {
    income: 0,
    expense: 0
  };
})();

// Controller
const controller = ((uiController, budgetController) => {
  return {
    init: function() {
      console.log("Initialized");
      uiController.updateBadget({
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
