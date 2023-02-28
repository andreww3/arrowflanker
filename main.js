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

const num_trials = 8;
const num_prac_trials = 5;

// INSTRUCTIONS =========================================================

var instructions = {
  type: jsPsychInstructions,
  pages: [`<p>In this task, you will see five arrows on the screen, like the example below.</p>
  <p class="stim"><<><<</p>
  <p>Your job is to indicate which direction the <strong>middle</strong> arrow is pointing.</p>`,

  `<p>Press <strong>A</strong> if the middle arrow is pointing left. (<)<br>
  Press <strong>L</strong> if it is pointing right. (>)</p>
  <p>Ignore the arrows on each side of the middle arrow - they are distractors.</p>`,

  `<p>To familiarise yourself with the task, here are ${num_prac_trials} practice trials</p>
  <p>Make sure your index fingers are on <strong>A</strong> and <strong>L</strong></p>
  <p>Once you click Next, the practice trials will begin.</p>`],
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
  choices: ['a', 'l'],
  on_finish: (data) => {
    console.log(data);
    var correct_response = key_mapping[data.direction];
    if (jsPsych.pluginAPI.compareKeys(data.response, correct_response)) {
      data.correct = true;
    } else {
      data.correct = false;
    }
  }
};

var feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    var last_trial_data = jsPsych.data.get().last(1).values()[0];
    return last_trial_data.correct ? '' : `<div class="stim feedback">WRONG</div>`;
  },
  choices: "NO_KEYS",
  trial_duration: () => {
    var last_trial_data = jsPsych.data.get().last(1).values()[0];
    return last_trial_data.correct ? 0 : 800;
  },
  post_trial_gap: 1000    // ITI
}

var trial = {
  timeline: [fixation, flanker, feedback],
  timeline_variables: test_stimuli,
  sample: {type: 'fixed-repetitions', size: num_trials/4}
}


// PRACTICE =============================================================

var practice_trial = {
  timeline: [fixation, flanker, feedback],
  timeline_variables: test_stimuli,
  sample: {type: 'with-replacement', size: num_prac_trials}
}

var practice_end = {
  type: jsPsychInstructions,
  pages: [`<p>Great! Now you will do the real task.</p>
  <p>There will be ${num_trials} trials</p>
  <p>Respond as quickly as you can without making mistakes</p>
  <p>Make sure your index fingers are on A and L</p>
  <p>Once you click Next, the task will begin.</p>`],
  show_clickable_nav: true
}

var practice = {
  timeline: [practice_trial, practice_end]
}

// ENDSCREEN ============================================================

var endscreen = {
  type: jsPsychInstructions,
  pages: () => {
    // compute mean RTs
    var data_cong = jsPsych.data.get().filter({condition: "congruent"});
    var data_incong = jsPsych.data.get().filter({condition: "incongruent"});
    var mrt_cong = data_cong.filter({correct: true}).select('rt').mean();
    var mrt_incong = data_incong.filter({correct: true}).select('rt').mean();
    var accu_cong = data_cong.filter({correct: true}).count() / (num_trials/2);
    var accu_incong = data_incong.filter({correct: true}).count() / (num_trials/2);

    return [`
      <p>Your mean RT for congruent trials is <strong>${Math.round(mrt_cong)} ms</strong>
      <br>
      You got <strong>${Math.round(accu_cong * 100)}%</strong> of these correct</p>
      <p>Your mean RT for incongruent trials is <strong>${Math.round(mrt_incong)} ms</strong>
      <br>
      You got <strong>${Math.round(accu_incong * 100)}%</strong> of these correct</p>
    `];
  },
  show_clickable_nav: true
}

// TIMELINE =============================================================

var timeline = [instructions, practice, trial, endscreen];

jsPsych.run(timeline);