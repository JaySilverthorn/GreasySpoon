# GreasySpoon

# Background

This project was built for Avero as a interview assignment.

The project is implemented using a Sprint Boot Starter which is a simple tomcat website embedded into a maven build.

# Prerequisites

Apache Maven 3.6.1
Java version: 1.8.0_211 (JDK)

The user must install these applications first before proceeding.

The application was built and tested on a Mac.  It may or maynot work on other platforms.

OS name: "mac os x", version: "10.14.4"

# Installation

$ git clone https://github.com/JaySilverthorn/GreasySpoon.git

# Build the project

$ cd ./GreasySpoon

$ mvn clean package spring-boot:repackage
 
# Run

$ java -jar target/greasy-spoon-1.0
