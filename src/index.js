
/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    methods = require('./methods');

/**
* App ID for the OrthodoxBrew skill
*/
var APP_ID = 'amzn1.echo-sdk-ams.app.bc7fd228-b919-4437-a54e-1212395c5592';

var OrthodoxBrew = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend Alexaskill
OrthodoxBrew.prototype = Object.create(AlexaSkill.prototype);
OrthodoxBrew.prototype.constructor = OrthodoxBrew;

OrthodoxBrew.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the OrthodoxBrew. You can ask a question like, what's the brew method for a french press? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

OrthodoxBrew.prototype.intentHandlers = {
  "GetBrewMethodIntent": function (intent, session, response) {
      var deviceSlot = intent.slots.Device,
          deviceName;
      if (deviceSlot && deviceSlot.value){
          deviceName = deviceSlot.value.toLowerCase();
      }

      var cardTitle = "Brew method for " + deviceName,
          method = methods[deviceName],
          speechOutput,
          repromptOutput;
      if (method) {
          speechOutput = {
              speech: method,
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          response.tellWithCard(speechOutput, cardTitle, method);
      } else {
          var speech;
          if (deviceName) {
              speech = "I'm sorry, I do not know the brew method for " + deviceName + ". What else can I help with?";
          } else {
              speech = "I'm sorry, I do not know that brew method. What else can I help with?";
          }
          speechOutput = {
              speech: speech,
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          repromptOutput = {
              speech: "What else can I help with?",
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
          };
          response.ask(speechOutput, repromptOutput);
      }
  },

  "AMAZON.HelpIntent": function (intent, session, response) {
      var speechText = "You can ask questions about orthodoxbrew such as, what's the brew method for a french press, or, you can say exit... Now, what can I help you with?";
      var repromptText = "You can say things like, what's the brew method for a french press, or you can say exit... Now, what can I help you with?";
      var speechOutput = {
          speech: speechText,
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
      var repromptOutput = {
          speech: repromptText,
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
      response.ask(speechOutput, repromptOutput);
  },

  "AMAZON.StopIntent": function (intent, session, response) {
      var speechOutput = "Goodbye";
      response.tell(speechOutput);
  },

  "AMAZON.CancelIntent": function (intent, session, response) {
      var speechOutput = "Goodbye";
      response.tell(speechOutput);
  }
};

exports.handler = function (event, context) {
    var orthodoxBrew = new OrthodoxBrew();
    orthodoxBrew.execute(event, context);
};
