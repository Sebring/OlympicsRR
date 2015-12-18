# Olympics RR
A html game inspired by "Video Olympics" for the Atari 2600. The game is built on [Crafty](https://github.com/craftyjs/Crafty) (craftyjs).

## Version
 * 0.3.1 :: New sport - Hockey
 * 0.3.0 :: "Fullscreen support" causing refactoring game logic - speed, positioning etc. 
 * 0.2.0 :: Gampad support!

## [Play](https://sebring.github.io)
Currently game is controlled by `WASD` and Arrow-keys. Press `U` to start a game and also to change game mode. Press `P` to pause/play. Gamepads can also be used, expected input is axis[1].

## Paddles
This game is meant to be controlled by 'paddles' (did I mention Atari 2600 already?). Either as USB HID on any computer or by using a Raspberry Pi 2 as dedicated game console. I will investigate both options to see what I like best and which solution causes least headache. 

### Dedicated rPi2 as console
I've had the rPi read analog potentiometer usig a MCP3008 chip and a 10k linear pot, but I found it pretty slow on running the javascript games. Of course this game is not optimized but still it's neither complex.

### Generic USB HID
Using a Arduino Leonardo I could plug the paddles to a computer and say it's a usb-joystick (or why not 8 usb-joysticks). The console will be the box (with the leo inside) and connectors to attach paddles.

This has now been realized as of version 0.2.0 using the fantastic library [MHeironimus/ArduinoJoystickLibrary](https://github.com/MHeironimus/ArduinoJoystickLibrary) for the Leo and adding the custom Crafty component [svenjacobs/crafty-gamepad](https://github.com/svenjacobs/crafty-gamepad).

#### Arduino Leonardo
This will get its own repo, but I'll just paste the 30'ish lines of code it took me to make two b10k pots to act as two joysticks aka gamepads aka paddels.
```
#include "Joystick2.h"

const int J_0 = A0;
const int J_1 = A1;
const unsigned long gcAnalogDelta = 80;
unsigned long gNextTime = 0;

void setup() {
  pinMode(J_0, INPUT);
  pinMode(J_1, INPUT);

	// click buttons to enable gamepads
  delay(2000);
  Joystick[0].begin(false);
  Joystick[1].begin(false);
  delay(100);
  Joystick[0].pressButton(0);
  Joystick[1].pressButton(1);
  delay(50);
  Joystick[0].releaseButton(0);
  Joystick[1].releaseButton(1);
}

void loop() {
  if (millis() > gNextTime) {
    gNextTime = millis() + gcAnalogDelta;
    updateXAxis(0, analogRead(J_0));
    updateXAxis(1, analogRead(J_1));
    Joystick[0].sendState();
    Joystick[1].sendState();
  }
}

void updateXAxis(int joystickId, unsigned int analogValue) {
  Joystick[joystickId].setYAxis(map(analogValue, 0, 1023, -127, 127));
}
```
