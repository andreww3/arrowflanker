const jsPsych = initJsPsych();

const test_stimuli = [
  {
    stimulus: '<div class="stim"><<<<<</div>',
    data: { condition: 'congruent', direction: 'left' }
  },
  {
    stimulus: '<div class="stim">>>>>></div>',
    data: { condition: 'congruent', direction: 'right' }
  },
  {
    stimulus: '<div class="stim"><<><<</div>',
    data: { condition: 'incongruent', direction: 'right' }
  },
  {
    stimulus: '<div class="stim">>><>></div>',
    data: { condition: 'incongruent', direction: 'left' }
  }
];

// TRIAL ================================================================

var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class="stim">+</div>',
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
  stimulus: `<div class="stim feedback">WRONG</div>`,
  choices: "NO_KEYS",
  trial_duration: () => {
    var jspsych_data = jsPsych.data.get();
    console.log(jspsych_data);
    //var last_trial_correct = jspsych_data.last(1).values()[0].correct;
    return 800;
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