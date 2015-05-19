# jsWire

Javascript wireworld engine, designed to run primes.wi as fast as possible. primes.wi downloaded from http://www.quinapalus.com/wires11.html

In principle it should run or be extensible to run any .wi file.

## Description

### Loading a File

The engine should be pointed at a file, and it will be loaded, displayed and run automatically.

### Generation Engine

I did some experiments with asm.js and it did work but is currently disabled. Generations are stored in two 1 MByte areas in a 3 MByte 
heap allocated by the main program.

Wire world values are stored in the heap as unsigned 8 bit values.

### Rendering

Currently there's three renderers:

 	1.	wwRender
    
	This renderer simply copies a generation to a Javascript canvas. Rect by painful rect.
	
	2. wwRenderChanged
	
	Renders only changed cells. This doesn't buy that much speed.
	
	3. tjRender
	
	This is the incomplete as yet three js renderer. It works very very fast, but just renders bare luminance values
	directly from the byte heap.

### Current Things to Work On

	1.	Fixing up the Three.js Renderer
	
	This needs to use a fragment shader that translates the Wire world values into colors passed as uniforms.
	
	2.	Generation Counter
	
	Need to add a generation counter and logic to estimate how many generations can be calculated between 60 fps 
	updates.
	
	3.	Texture-based Simulation
	
	It should be simple to ping-pong generations between two textures for really fast performance.

