
#!/bin/sh

## Install Libaries
npm install

## The folder for all the ardunio sketches
mkdir sketches



## Install The Arduino Library
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

## Installing boards
arduino-cli core install arduino:avr
arduino-cli core install arduino:megaavr

# Installing github library
arduino-cli lib install "Adafruit NeoPixel"
arduino-cli lib install "LiquidCrystal I2C"arduino-cli lib list

arduino-cli lib install "Adafruit Motor Shield library"
arduino-cli lib install Servo
arduino-cli lib install IRremote
arduino-cli lib install "DHT sensor library"

## ADDED MARCH 5, 2021
arduino-cli lib install "NTC_Thermistor"

## ADDED MARCH 11 2021
arduino-cli lib install "Stepper"

## ADDED DECEMBER 8 2021
arduino-cli lib install "FastLED"



