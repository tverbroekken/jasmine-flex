// Bootstrap Test Reporter function
var reporter = function () {

  var total = 0;
  var passes = 0;
  var fails = 0;

  var that = {
    test: function (result, message) {
      total++;

      if (result) {
        passes++;
        iconElement = $('icons');
        iconElement.appendChild(new Element('img', {src: '../images/accept.png'}));
      }
      else {
        fails++;
        var failsHeader = $('fails_header');
        failsHeader.show();

        iconElement = $('icons');
        iconElement.appendChild(new Element('img', {src: '../images/exclamation.png'}));

        var failMessages = $('fail_messages');
        var newFail = new Element('p', {class: 'fail'});
        newFail.innerHTML = message;
        failMessages.appendChild(newFail);
      }
    },

    summary: function () {
     summary = new Element('p', {class: ((fails > 0) ? 'fail_in_summary' : '') });
     summary.innerHTML = total + ' tests, ' + passes + ' passing, ' + fails + ' failed.';
     var summaryElement = $('results_summary');
     summaryElement.appendChild(summary);
     summaryElement.show();
    }
  }
  return that;
}();

var testMatchersComparisons = function () {
  Jasmine = jasmine_init();

  reporter.test(expects_that(true).should_equal(true),
                 'expects_that(true).should_equal(true) returned false');

  reporter.test(!(expects_that(false).should_equal(true)),
                 'expects_that(true).should_equal(true) returned true');

  reporter.test(expects_that(true).should_not_equal(false),
                 'expects_that(true).should_not_equal(false) retruned false');

  reporter.test(!(expects_that(true).should_not_equal(true)),
                 'expects_that(true).should_not_equal(false) retruned true');
}

var testMatchersReporting = function () {
  Jasmine = jasmine_init();

  expects_that(true).should_equal(true);
  expects_that(false).should_equal(true);

  reporter.test((Jasmine.results.length == 2),
                 "Jasmine results array doesn't have 2 results");

  reporter.test((Jasmine.results[0].passed == true),
                 "First spec didn't pass");

  reporter.test((Jasmine.results[1].passed == false),
                 "Second spec did pass");

  Jasmine = jasmine_init();

  expects_that(false).should_equal(true);

  reporter.test((Jasmine.results[0].message == 'Expected true but got false.'),
                 "Failed expectation didn't test the failure message");

  Jasmine = jasmine_init();

  expects_that(true).should_equal(true);

  reporter.test((Jasmine.results[0].message == 'Passed.'),
                "Passing expectation didn't test the passing message");
}

var testSpecs = function () {
  Jasmine = jasmine_init();
  var spec = it('new spec');
  reporter.test((spec.description == 'new spec'),
                "Spec did not have a description");

  Jasmine = jasmine_init();
  var another_spec = it('another spec', function () {
    var foo = 'bar';
    expects_that(foo).should_equal('bar');
  });
  another_spec.execute();

  reporter.test((Jasmine.results.length == 1),
                "Results aren't there after a spec was executed");
  reporter.test((Jasmine.results[0].passed == true),
                "Results has a result, but it's true");

  Jasmine = jasmine_init();
  var yet_another_spec = it('spec with failing expectation', function () {
    var foo = 'bar';
    expects_that(foo).should_equal('baz');
  });
  yet_another_spec.execute();

  reporter.test((Jasmine.results[0].passed == false),
                "Expectation that failed, passed");

  Jasmine = jasmine_init();
  var yet_yet_another_spec = it('spec with multiple assertions', function () {
    var foo = 'bar';
    var baz = 'quux';

    expects_that(foo).should_equal('bar');
    expects_that(baz).should_equal('quux');
  });
  yet_yet_another_spec.execute();

  reporter.test((Jasmine.results.length == 2),
                "Spec doesn't support multiple expectations");
}

var runTests = function () {
  $('spinner').show();

  testMatchersComparisons();
  testMatchersReporting();
  testSpecs();

  $('spinner').hide();
  reporter.summary();
}