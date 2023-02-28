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

const key_mapping = {left: 'a', right: 'l'};

// INSTRUCTIONS =========================================================

var instructions = {
  type: jsPsychInstructions,
  pages: [],
  show_clickable_nav: true
}

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
  stimulus: () => {
    var last_trial_data = jsPsych.data.get().last(1).values()[0];
    var correct_response = key_mapping[last_trial_data.direction];
    if (jsPsych.pluginAPI.compareKeys(last_trial_data.response, correct_response)) { // if correct response
      return '';
    } else {
      return `<div class="stim feedback">WRONG</div>`; // WRONG
    }
  },
  choices: "NO_KEYS",
  trial_duration: () => {
    var last_trial_data = jsPsych.data.get().last(1).values()[0];
    var correct_response = key_mapping[last_trial_data.direction];
    if (jsPsych.pluginAPI.compareKeys(last_trial_data.response, correct_response)) { // if correct response
      return 0;
    } else {
      return 800; // 800ms
    }
  },
  post_trial_gap: 1000    // ITI
}

var trial = {
  timeline: [fixation, flanker, feedback],
  timeline_variables: test_stimuli,
  sample: {type: 'fixed-repetitions', size: 15}
}

// ENDSCREEN ============================================================

var endscreen = {
  type: jsPsychInstructions,
  pages: () => {
    // compute mean RTs
    var data_cong = jsPsych.data.get().filter({condition: "congruent"});
    var data_incong = jsPsych.data.get().filter({condition: "incongruent"});
    var mrt_cong = data_cong.select('rt').mean();
    var mrt_incong = data_incong.select('rt').mean();

    return [`
      <p>Your mean congruent RT is ${mrt_cong} ms</p>
      <p>Your mean incongruent RT is ${mrt_incong} ms</p>
    `];
  },
  show_clickable_nav: true
}

// TIMELINE =============================================================

var timeline = [trial];

jsPsych.run(timeline);