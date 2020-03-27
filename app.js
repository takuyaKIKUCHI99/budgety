// View module
const uiController = (function() {})();

// Budget model
const budgetController = (function() {})();

// Controller
const controller = (function(uiController, budgetController) {
  return {
    init: function() {
      console.log("Initialized");
    }
  };
})(uiController, budgetController);

// Initialing app
controller.init();
