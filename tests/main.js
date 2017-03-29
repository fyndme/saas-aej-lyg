test('greeting', function(){
  return newTest()
    .expectText('Welcome to trivia time!')
    .run();
})

test('menu', function(){
  return newTest()
    .expectText('Welcome to trivia time!')
    .expectText('Pick a trivia topic')
    .expectText('history or sports')
    .expectButtons()
    .run();
})

test('gameplay', function() {
  return newTest()
    .checkForTrailingDialogs()
    .expectText('Welcome to trivia time!')
    .expectText('Pick a trivia topic')
    .expectText('history or sports')
    .sendText('history')
    .expectText('Time to test you on history!')
    .expectText('Question 1')
    .expectText('Is it:')
    .expectText('a2 or a3 or a4 or a1')
    .run();
})

test('intent', function() {
  return newTest()
    .checkForTrailingDialogs()
    .expectText('Welcome to trivia time!')
    .expectText('Pick a trivia topic')
    .expectText('history or sports')
    .sendText('history')
    .expectText('Time to test you on history!')
    .expectText('Question 1')
    .expectText('Is it:')
    .expectText('a2 or a3 or a4 or a1')
    .sendText('a1')
    .expectText('Correct!')
    .expectText('Your score is 1')
    .expectText('Question 2')
    .expectText('Is it:')
    .expectText('a2 or a3 or a4 or a1')
    .sendText('help')
    .expectText('You are in the history section')
    .expectText('Question 2')
    .expectText('Is it:')
    .expectText('a2 or a3 or a4 or a1')
    .run();
})