# Olympics RR
A html game inspired by "Video Olympics" for the Atary 2600. The game is built on [Crafty](https://github.com/craftyjs/Crafty) (craftyjs).

## [Play Alpha 0.2.0](https://sebring.github.io)
Currently game is controlled by `WASD` and Arrow-keys. Press `U` to start a game and also to change game mode. Press `P` to pause/play.

## Goal
The goal for this game is to be controlled by homemade 'paddles' (did I mention Atari 2600 already?). Either as USB HID on any computer or by using a Raspberry Pi 2 as dedicated game console. I will investigate both options to see what I like best and which solution causes least headache. 

### Dedicated rPi2 as console
I've had the rPi read analog potentiometer usig a MCP3008 chip and a 10k linear pot, but I found it pretty slow on running the javascript games. Of course this game is not optimized but still it's neither complex.

### Generic USB HID
Using a Arduino Leonardo I could plug the paddles to a computer and say it's a usb-joystick (or why not 8 usb-joysticks). The console will be the box (with the leo inside) and connectors to attach paddles.
