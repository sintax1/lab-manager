'use strict';

describe('Component: LabsComponent', function() {
  // load the controller's module
  beforeEach(module('labManagerApp.labs'));

  var LabsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    LabsComponent = $componentController('labs', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
