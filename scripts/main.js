const trivia = {
  'history': [ // this is a trivia topic
    { q: 'When did this happen?', // this is the question we will ask the user
      w: ['answer 2', 'answer 3', 'answer 4'], // these are wrong answers
      c: 'answer 1', // this is the correct answer
     },
     { q: 'When did that happen?', w: ['answer 2', 'answer 3', 'answer 4'], c: 'answer 1' },
     { q: 'When will this happen?', w: ['answer 2', 'answer 3', 'answer 4'], c: 'answer 1' },
   ],
   'sports': [
    { q: 'Who did this?', w: ['answer 2', 'answer 3', 'answer 4'], c: 'answer 1' },
    { q: 'Max score for that?', w: ['answer 2', 'answer 3', 'answer 4'], c: 'answer 1' },
    { q: 'Best at this?', w: ['answer 2', 'answer 3', 'answer 4'], c: 'answer 1' },
   ],
};

addGreeting((user, response) => {
  response.sendText('Welcome to trivia time!');
  user.score = 0; //set the user's score to 0
});
// after the greeting is sent the default script will be called

newScript() // 
  .dialog('start', (session, response, stop) => {
    const topics = Object.keys(trivia);

    response.sendText(`Pick a trivia topic: ${topics.join(' or ')}`);

    const buttons = response.createButtons();
    buttons.addButton('postback', 'Check score', '@@check_score');
    topics.forEach(topic => {
        buttons.addButton('postback', topic, topic);
    })
    buttons.send();
  })
  .expect
    .button('@@check_score', (session, response) => {
      response.sendText(`Your score is ${session.user.score}`);
    })
    .button((session, response) => {
      response.startScript(session.message.payload);
    })
    .text((session, response, stop) => {
      response.startScript(session.message.text);
    });

Object.keys(trivia).forEach((topic) => { // iterate through each topic
  newScript(topic) // a new script with the topic name
    /* 
     * begin dialogs are like greetings for scripts, they are only sent once
     */
    .begin((session, response, stop) => { 
      response.sendText(`Time to test you on ${topic}!`);
      session.user.topic = topic;
      session.user.question_number = 0; // Reset what question the user is on
    })
    .intent.always('general', 'help', (session, response) => {
      response.sendText(`You are in the ${topic} section`);
      response.goto('start');
    })
    .intent.
    /* 
     * If the dialog doesn't call stop() then the script will automatically flow 
     * to the next dialog. We can also use named dialogs to move around a script
     * we'll use this later to loop around the questions
     */
    .dialog('start', (session, response, stop) => {
      const question = trivia[topic][session.user.question_number];
      const answers = question.w.concat(question.c); //exercise for the reader to shuffle these!
      response
        .sendText(question.q)  
        .sendText(`Is it: ${answers.join(' or ')}`); //notice how you can chain responses (but don't have to!)
      const buttons = response
        .createButtons()
        .text('type or pick');
      answers.forEach(answer => buttons.addButton('postback', answer, answer));
      buttons.send();
    })
    /* 
     * The script will stop here because the next dialog is an expect dialog, which tells
     * alana to wait for input from the user. We can even specialize the expect to only 
     * response to a text message.
     */
    .expect
      .button((session, response, stop) => {
        checkAnswer(session.message.payload, session, response);
      })
      .text((session, response, stop) => {
        checkAnswer(session.message.text, session, response);
      });
    /* 
     * At the end of script, alana will automatically move the user to the default
     * script, usually the main menu
     */
});

function checkAnswer(input, session, response) {
  const question = trivia[session.user.topic][session.user.question_number];
  if (input === question.c) {
    response.sendText('Correct!');
    session.user.score = Math.max(1, session.user.score + 1);
  } else {
    response.sendText(`Wrong :( it was "${question.c}"`);
    session.user.score = Math.max(0, session.user.score - 1);
  }
  response.sendText(`Your score is ${session.user.score}`);
  session.user.question_number++;
  if (session.user.question_number < trivia[session.user.topic].length) {
    // we still have questions, ask the next one
    response.goto('start');
  }
}