const jsPsych = initJsPsych();

const test_stimuli = [
  {
    stimulus: '<p style="font-size: 48px;"><strong><<<<<</strong></p>',
    data: { condition: 'congruent', direction: 'left'}
  },
  {
    stimulus: '<p style="font-size: 48px;"><strong>>>>>></strong></p>',
    data: { condition: 'congruent', direction: 'right'}
  },
  {
    stimulus: '<p style="font-size: 48px;"><strong><<><<</strong></p>',
    data: { condition: 'incongruent', direction: 'right'}
  },
  {
    stimulus: '<p style="font-size: 48px;"><strong>>><>></strong></p>',
    data: { condition: 'incongruent', direction: 'left'}
  }
];

// TRIAL ================================================================

var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<p style="font-size: 48px;">+</p>',
  choices: "NO_KEYS",
  trial_duration: 400,
};

var flanker = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  data: jsPsych.timelineVariable('data'),
  choices: ['a', 'l']
};

var feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "WRONG",
  choices: "NO_KEYS",
  trial_duration: (data) => {
    console.log(data);
  },
  post_trial_gap: 1000
}

// var feedback_timeline = {
//   timeline: [feedback],
//   conditional_function: () => {

//   }
// }

// var iti = {
//   type: jsPsychHtmlKeyboardResponse,
//   stimulus: '<p style="font-size: 48px;">+</p>',
//   choices: "NO_KEYS",
//   trial_duration: 400,
// };


var trial = {
  timeline: [fixation, flanker, feedback],
  timeline_variables: test_stimuli,
  sample: {type: 'fixed-repetitions', size: 15}
}

// TIMELINE =================================================================

var timeline = [trial];

jsPsych.run(timeline);