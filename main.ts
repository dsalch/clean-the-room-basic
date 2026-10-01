/**
 * Clean the Room Robot Program
 * 
 * * Description:
 * 
 * The robot operates in two modes: "roam" and "clean".
 * 
 * * Roam Mode:
 * 
 * - The robot moves forward within an area defined by a black line.
 * 
 * - If it detects the black line with its left or right sensor, it backs up and turns away.
 * 
 * - It continuously checks for obstacles using the front IR sensor.
 * 
 * * Clean Mode:
 * 
 * - Triggered when an obstacle is detected in roam mode.
 * 
 * - The robot plays a short sound ("ba_ding").
 * 
 * - It then pushes the obstacle straight forward.
 * 
 * - It stops pushing when it detects the black line boundary.
 * 
 * - After reaching the boundary, it backs up a short distance and then switches back to roam mode.
 */
// Handles the robot's behavior when in "clean" mode.
function cleanMode () {
    // Stop the robot momentarily before starting the cleaning action.
    mbit_Robot.CarCtrl(mbit_Robot.CarState.Car_Stop)
    Count += 1
    basic.showNumber(Count)
    // Play a sound to indicate that cleaning has started.
    mbit_Robot.Music_Car(mbit_Robot.enMusic.chase)
    // Wait for the sound to play
    basic.pause(1000)
    // Start pushing the object forward and keep pushing
    // until the black line boundary is detected.
    while (true) {
        // Move forward to push the object
        mbit_Robot.CarCtrlSpeed(mbit_Robot.CarState.Car_Run, 60)
        // If either the left OR the right sensor detects the black line,
        // it means we've reached the wall.
        if (mbit_Robot.Line_Sensor(mbit_Robot.enPos.LeftState, mbit_Robot.enLineState.Black) || mbit_Robot.Line_Sensor(mbit_Robot.enPos.RightState, mbit_Robot.enLineState.Black)) {
            // Exit the while loop
            break;
        }
        // A small pause to prevent the loop from running too fast
        basic.pause(20)
    }
    // Now that the object has been pushed to the wall, stop.
    mbit_Robot.CarCtrl(mbit_Robot.CarState.Car_Stop)
    // Play a sound to indicate that cleaning has started.
    mbit_Robot.Music_Car(mbit_Robot.enMusic.ba_ding)
    // Back away from the object and the wall.
    mbit_Robot.CarCtrlSpeed(mbit_Robot.CarState.Car_Back, 45)
    // Back up for half a second
    basic.pause(1000)
    // Stop completely.
    mbit_Robot.CarCtrl(mbit_Robot.CarState.Car_Stop)
    mbit_Robot.CarCtrlSpeed(mbit_Robot.CarState.Car_SpinLeft, 45)
    // Back up for half a second
    basic.pause(1000)
    mbit_Robot.CarCtrl(mbit_Robot.CarState.Car_Stop)
    // The cleaning task is done. Switch back to roam mode.
    mode = "roam"
}
// Handles the robot's behavior when in "roam" mode.
function roamMode () {
    // First, check if there's an obstacle. This is the highest priority.
    // If an obstacle is detected, switch to "clean" mode and exit this function.
    if (mbit_Robot.Avoid_Sensor(mbit_Robot.enAvoidState.OBSTACLE)) {
        // Change the mode
        mode = "clean"
        // Exit immediately to let the main loop switch to cleanMode()
        return
    }
    // Check the line sensors to stay within the "room".
    // If the left sensor sees the black line...
    // If the right sensor sees the black line...
    // If no obstacles or lines are detected, just keep moving forward.
    if (mbit_Robot.Line_Sensor(mbit_Robot.enPos.LeftState, mbit_Robot.enLineState.Black)) {
        // Back up a little
        mbit_Robot.CarCtrlSpeed(mbit_Robot.CarState.Car_Back, 50)
        basic.pause(500)
        // Then, spin to the right to turn away from the line
        mbit_Robot.CarCtrlSpeed(mbit_Robot.CarState.Car_SpinRight, 60)
        basic.pause(randint(200, 500))
    } else if (mbit_Robot.Line_Sensor(mbit_Robot.enPos.RightState, mbit_Robot.enLineState.Black)) {
        // Back up a little
        mbit_Robot.CarCtrlSpeed(mbit_Robot.CarState.Car_Back, 50)
        basic.pause(500)
        // Then, spin to the left to turn away from the line
        mbit_Robot.CarCtrlSpeed(mbit_Robot.CarState.Car_SpinLeft, 60)
        basic.pause(randint(200, 500))
    } else {
        mbit_Robot.CarCtrlSpeed(mbit_Robot.CarState.Car_Run, 50)
    }
}
let Count = 0
let mode = ""
// A variable to keep track of the robot's current mode.
// It can be either "roam" or "clean".
mode = "roam"
Count = 0
// The main loop that runs forever.
// It checks the current mode and calls the appropriate function.
basic.forever(function () {
    if (mode == "roam") {
        roamMode()
    } else if (mode == "clean") {
        cleanMode()
    }
})
