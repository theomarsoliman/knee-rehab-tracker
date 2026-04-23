import { Exercise, Phase } from '@/types';

export const EXERCISES: Exercise[] = [
  // Phase 1: Calm Down (Weeks 1-2)
  {
    id: 'p1-1',
    name: 'Straight Leg Raises',
    phase: 1,
    sets: 3,
    reps: '10 each leg',
    instructions: 'Lie on your back with one knee bent and foot flat. Keep the affected leg straight and lift it to the height of the bent knee. Hold for 3 seconds, lower slowly.',
    whatToAvoid: 'Do not hold your breath. Do not arch your back.',
    icon: '🦵',
  },
  {
    id: 'p1-2',
    name: 'Glute Bridges',
    phase: 1,
    sets: 3,
    reps: '10 reps',
    instructions: 'Lie on your back with knees bent, feet flat. Squeeze glutes and lift hips toward ceiling. Hold for 3 seconds at top, lower slowly.',
    whatToAvoid: 'Do not push hips too high. Keep core engaged.',
    icon: '🍑',
  },
  {
    id: 'p1-3',
    name: 'Short Arc Quads',
    phase: 1,
    sets: 3,
    reps: '10 each leg',
    instructions: 'Lie on your back with a rolled towel or foam roller under your knee. Straighten your knee by tightening your quad. Hold 3 seconds.',
    whatToAvoid: 'Do not fully straighten the knee if it causes pinching.',
    icon: '💪',
  },

  // Phase 2: Build Strength (Weeks 3-4)
  {
    id: 'p2-1',
    name: 'Terminal Knee Extensions',
    phase: 2,
    sets: 3,
    reps: '10 each leg',
    instructions: 'Lie on your back with knee slightly bent over a rolled towel. Straighten knee by tightening quad. Hold 3 seconds. This is different from leg extensions at the gym.',
    whatToAvoid: 'NO gym leg extensions. This is a lying-down, controlled movement only.',
    icon: '🦵',
  },
  {
    id: 'p2-2',
    name: 'Side Leg Raises',
    phase: 2,
    sets: 3,
    reps: '10 each leg',
    instructions: 'Lie on your side with legs stacked. Lift top leg toward ceiling about 45 degrees. Hold 3 seconds, lower slowly.',
    whatToAvoid: 'Do not rotate your hip. Keep your body in a straight line.',
    icon: '➡️',
  },
  {
    id: 'p2-3',
    name: 'Wall Sits',
    phase: 2,
    sets: 3,
    reps: '30 seconds',
    instructions: 'Stand with back against wall. Slide down until thighs are parallel to floor. Hold position.',
    whatToAvoid: 'Stop if you feel pinching. Do not go too deep.',
    icon: '🧱',
  },
  {
    id: 'p2-4',
    name: 'Gentle ROM',
    phase: 2,
    sets: 2,
    reps: '10 each direction',
    instructions: 'Sit on chair. Slowly slide foot in and out to bend and straighten knee. Do not push into pinching. Stay within pain-free range.',
    whatToAvoid: 'Never push into pinching pain. Stop at first sign of sharp pain.',
    icon: '🔄',
  },

  // Phase 3: Progressive Loading (Weeks 5-8)
  {
    id: 'p3-1',
    name: 'Bodyweight Squats',
    phase: 3,
    sets: 3,
    reps: '10-15 reps',
    instructions: 'Stand feet shoulder-width apart. Slowly lower by pushing hips back as if sitting in a chair. Go to 90 degrees or just before pinching starts.',
    whatToAvoid: 'No deep squats. Stop at 90 degrees or when pinching begins.',
    icon: '🏋️',
  },
  {
    id: 'p3-2',
    name: 'Step Ups',
    phase: 3,
    sets: 3,
    reps: '10 each leg',
    instructions: 'Step up onto a low step (6-8 inches) with affected leg. Control the movement both up and down.',
    whatToAvoid: 'Use a low step only. Do not jump or land hard.',
    icon: '🪜',
  },
  {
    id: 'p3-3',
    name: 'Romanian Deadlifts',
    phase: 3,
    sets: 3,
    reps: '10 reps',
    instructions: 'Stand with feet hip-width apart. Keep knees slightly bent, hinge at hips to lower torso. Feel stretch in hamstrings, then return to standing.',
    whatToAvoid: 'Keep back straight. Do not round your spine.',
    icon: '🦴',
  },
  {
    id: 'p3-4',
    name: 'Daily ROM Work',
    phase: 3,
    sets: 1,
    reps: '5 minutes',
    instructions: 'Actively work on knee flexion and extension. Use heel slides, seated knee bends, or any pain-free movement to improve range.',
    whatToAvoid: 'Never push into pinching. Gentle, controlled movements only.',
    icon: '📅',
  },

  // Phase 4: Return to Sport (Weeks 9-12)
  {
    id: 'p4-1',
    name: 'Jogging',
    phase: 4,
    sets: 1,
    reps: '10-15 minutes',
    instructions: 'Start with light jogging on flat ground. Build up duration gradually. Focus on landing softly.',
    whatToAvoid: 'Stop if pinching returns. No sprinting yet.',
    icon: '🏃',
  },
  {
    id: 'p4-2',
    name: 'Lateral Movement',
    phase: 4,
    sets: 2,
    reps: '5 minutes',
    instructions: 'Practice side steps, lateral lunges, or crossover steps. Start slow and controlled.',
    whatToAvoid: 'Avoid sudden, explosive lateral movements until confident.',
    icon: '↔️',
  },
  {
    id: 'p4-3',
    name: 'Agility Drills',
    phase: 4,
    sets: 2,
    reps: '10 minutes',
    instructions: 'Light cone drills, shuttle runs at 50% speed. Focus on form over speed.',
    whatToAvoid: 'No competitive play yet. Build up gradually.',
    icon: '🔶',
  },
  {
    id: 'p4-4',
    name: 'Return to Football',
    phase: 4,
    sets: 1,
    reps: 'As tolerated',
    instructions: 'Gradual return to training with team. Start with non-contact, build to full practice.',
    whatToAvoid: 'Listen to your body. If pinching returns, back off.',
    icon: '⚽',
  },
];

export const PHASE_INFO: Record<Phase, { name: string; color: string; weeks: string; description: string }> = {
  1: {
    name: 'Calm Down',
    color: '#60A5FA', // blue
    weeks: 'Weeks 1-2',
    description: 'Reduce inflammation and pain. Focus on gentle activation.',
  },
  2: {
    name: 'Build Strength',
    color: '#34D399', // green
    weeks: 'Weeks 3-4',
    description: 'Strengthen supporting muscles. Begin gentle ROM work.',
  },
  3: {
    name: 'Progressive Loading',
    color: '#FBBF24', // amber
    weeks: 'Weeks 5-8',
    description: 'Build strength and restore full ROM through controlled loading.',
  },
  4: {
    name: 'Return to Sport',
    color: '#F87171', // red
    weeks: 'Weeks 9-12',
    description: 'Gradual return to running, lateral movement, and sport.',
  },
};

export const getCurrentPhase = (startDate: string): Phase => {
  const start = new Date(startDate);
  const now = new Date();
  const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceStart < 14) return 1;
  if (daysSinceStart < 28) return 2;
  if (daysSinceStart < 56) return 3;
  return 4;
};

export const getExercisesForPhase = (phase: Phase): Exercise[] => {
  return EXERCISES.filter((e) => e.phase === phase);
};
