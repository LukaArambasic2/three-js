import {GameEntity, StateMachine} from "yuka";
import {IdleState, WalkState, RunState} from "./states.js";

class Astro extends GameEntity {
    constructor(mixer, animations) {
        super();
        this.mixer = mixer;
        this.animations = animations;
        this.stateMachine = new StateMachine(this);

        this.stateMachine.add('IDLE', new IdleState());

        this.stateMachine.add('WALK', new WalkState());
        this.stateMachine.add('RUN', new RunState());
        this.stateMachine.changeTo('IDLE')

        console.log("Been called")

        this.crossFadeDuration = 1;
        this.isRunning = false;

        this.energy = 0;
        this.deltaTime = 0;


    }

    update(delta) {
        this.mixer.update(delta);

        this.stateMachine.update();

        this.deltaTime = delta;

        return this;
    }
}

export {Astro};