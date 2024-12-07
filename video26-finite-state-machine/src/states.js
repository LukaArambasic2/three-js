import {State} from "yuka";

const IDLE = 'IDLE';
const WALK = 'WALK';
const RUN = 'RUN';

class IdleState extends State {
    enter(astro) {
        const idle = astro.animations.get(IDLE);
        idle.reset().fadeIn(astro.crossFadeDuration);
    }
    execute(astro) {
        if (astro.isRunning) {
            astro.stateMachine.changeTo(RUN);
        }
        astro.energy += astro.deltaTime;
        if (astro.energy > 3) {
            astro.stateMachine.changeTo(WALK);
        }
    }
    exit(astro) {
        const idle = astro.animations.get(IDLE);
        idle.fadeOut(astro.crossFadeDuration);
    }
}

class RunState extends State {
    enter(astro) {

        const run = astro.animations.get(RUN);
        run.reset().fadeIn(astro.crossFadeDuration);
    }
    execute(astro) {
        if (!astro.isRunning) {
            astro.stateMachine.changeTo(IDLE);
        }
    }
    exit(astro) {
        const run = astro.animations.get(RUN);
        run.fadeOut(astro.crossFadeDuration);
    }
}

class WalkState extends State {
    enter(astro) {
        const walk = astro.animations.get(WALK);
        walk.reset().fadeIn(astro.crossFadeDuration);
    }
    execute(astro) {
        if (astro.isRunning) {
            astro.stateMachine.changeTo(RUN);
        }
        astro.energy -= astro.deltaTime;
        if (astro.energy <= 0) {
            astro.stateMachine.changeTo(IDLE);
        }
    }
    exit(astro) {
        const walk = astro.animations.get(WALK);
        walk.fadeOut(astro.crossFadeDuration);
    }
}


export {IdleState, WalkState, RunState};








