// View module
const uiController = (() => {
  // DOM
  const budgeValue = document.querySelector(".budget__value");
  const incomeValue = document.querySelector(".budget__income--value");
  const expenseValue = document.querySelector(".budget__expenses--value");
  const thisMonth = document.querySelector(".budget__title--month");

  return {
    updateBadget: function(args) {
      budgeValue.textContent = args.budget;
      incomeValue.textContent = args.income;
      expenseValue.textContent = args.expense;
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
        expense: 0
      });
      uiController.displayMonth();
    }
  };
})(uiController, budgetController);

// Initialing app
controller.init();
