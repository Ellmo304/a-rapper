const Alexa = require('alexa-sdk');

const OpearloAnalytics = require('opearlo-analytics');

const APP_ID = 'amzn1.ask.skill.4451201d-dae8-4a0e-9e51-b948b5fb4b7a';

const opearloApiKey = 'RrTGUvJLyz3w5yR8zaC5p5V7Q83VCnfv6M8fnrCE';
const opearloUserId = 'kJnUOYznWOZmmLEv4aUesaMrOg63';
const voiceAppName = 'a-rapper';

const rappers = require('./data/rappers');

const welcomeMessage = 'It\'s rhyme time baby! Ask your favourite rapper for some bars or some valuable advice!';
const prompt = 'Go ahead!';
const reprompt = 'Try saying, ask kendrick for some bars.';
const helpMessage = 'Get some advice from a rapper by saying: ask a rapper for advice. Get some sick bars by saying: ask a rapper for some bars.';
const goodbyeMessage = 'Stay real, homie!';

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', welcomeMessage, reprompt);
  },
  'GetAdviceIntent': function () {
    let rapper = 'a rapper';
    if (this.event.request.intent.slots.rapper.value) {
      rapper = this.event.request.intent.slots.rapper.value;
      // const voiceContentID = rapper.replace(/\s+/g, '-').toLowerCase();
    }
    this.emit(':ask', `${rapper} thinks you should get real, yo!`);
  },
  'GetBarsIntent': function () {
    const random = Math.ceil(Math.random() * rappers.length);
    let chosenRapper = 'a rapper';
    if (this.event.request.intent.slots.rapper.value) {
      const rapper = this.event.request.intent.slots.rapper.value;
      for (let i = 0; i < rappers.length; i++) {
        if (rappers[i].names.includes(rapper)) {
          chosenRapper = rappers[i];
        }
      }
    }
    if (chosenRapper !== 'a rapper') {
      this.emit(':ask', `Here are some bars from ${chosenRapper.names[0]}. ${chosenRapper.bars}. Would you like to ask another rapper?`, 'Would you like to ask another rapper?');
    }
    else {
      this.emit(':ask', `Here are some bars from ${rappers[random].names[0]}. ${rappers[random].bars}. Would you like to ask another rapper?`, 'Would you like to ask another rapper?');
    }
  },
  'AMAZON.StopIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, opearloApiKey, (result) => {
      this.emit(':tell', goodbyeMessage);
    });
  },
  'AMAZON.CancelIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, opearloApiKey, (result) => {
      this.emit(':tell', goodbyeMessage);
    });
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', helpMessage, reprompt);
  },
  'AMAZON.YesIntent': function () {
    this.emit(':ask', prompt, reprompt);
  },
  'AMAZON.NoIntent': function () {
    this.emit('AMAZON.StopIntent');
  },
  'SessionEndedRequest': function () {
    // Use this function to clear up and save any data needed between sessions
    this.emit('AMAZON.StopIntent');
  },
  'Unhandled': function () {
    this.emit('AMAZON.HelpIntent');
  },
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  if (event.session.new) {
    OpearloAnalytics.initializeAnalytics(opearloUserId, voiceAppName, event.session);
  }
  if (event.request.type === 'IntentRequest') {
    OpearloAnalytics.registerVoiceEvent(event.session.user.userId, 'IntentRequest', event.request.intent);
  }
  alexa.execute();
};
