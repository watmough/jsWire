/*

wwFunctions.js

Copyright 2015 Jonathan Watmough

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function wwFunctions(stdlib, foreign, heap)
{
//	"use asm";
	
	// globals
	// heap needs to be couple of megs
	var H32 = new stdlib.Int32Array(heap);
	
	// create a couple of fast buffers, index at 0 and 1Meg
	var state = new stdlib.Uint8Array(heap);
	var chng = new stdlib.Uint16Array(heap);
	
	// functions
	var imul = stdlib.Math.imul;
	
	// simulate a generation
	// buffer: 0 = 0 -> 1
	//         1 = 1 -> 0
	function wwStep(buffer,width,linecount) {
		buffer = buffer |0;
		width = width |0;
		linecount = linecount |0;
		var y=0;
		var x=0;
		var x3=0;
		var val=0;
		var b1=0;
		var b2=0;
		var b13=0;
		var b23=0;
		var b3=4194304;		// 16 bit / 4 = 2 Meg pos
		var count=0;
		var pos=0;
		var pos3=0;
		var width3 = imul(width,8)|0;
		
		// program
		switch(buffer|0) {
		case 0:
			b1 = 0;
			b2 = 1048576;
			b13 = 0;
			b23 = 8388608;
			break;
		default:
			b1 = 1048576;
			b2 = 0;
			b13 = 8388608;
			b23 = 0;
		}
				
		for(y=1;(y|0)<((linecount-2)|0);y=(y+1)|0) {
			for(x=1;(x|0)<((width-2)|0);x=(x+1)|0) {
				x3 = x<<3;
				count = 0;
				pos = imul(y,width)|0;
				pos3 = (pos<<3)|0;
				val = state[(b13+pos3+x3)>>3]|0;
				// space -> nop, head-> tail, tail->copper
				// head -> tail
				if((val|0)==0x40) {
					state[(b23+(pos3|0)+(x3|0))>>3] = 0x7e;
					// save list of changed cells
					chng[b3>>2] = x; b3 = (b3+4)|0;
					chng[b3>>2] = y; b3 = (b3+4)|0;
				}
				// tail -> conductor
				if((val|0)==0x7e) {
					state[(b23+(pos3|0)+(x3|0))>>3] = 0x23;
					// save list of changed cells
					chng[b3>>2] = x; b3 = (b3+4)|0;
					chng[b3>>2] = y; b3 = (b3+4)|0;
				}
				// check for conductor
				if((val|0)==0x23) {
					// top row
					if((state[(b13+pos3-width3+x3-8)>>3])==0x40)	count = (count+1)|0;
					if((state[(b13+pos3-width3+x3)>>3])==0x40)		count = (count+1)|0;
					if((state[(b13+pos3-width3+x3+8)>>3])==0x40)	count = (count+1)|0;
					
					// middle
					if((state[(b13+pos3+x3-8)>>3])==0x40)			count = (count+1)|0;
					if((state[(b13+pos3+x3+8)>>3])==0x40)			count = (count+1)|0;

					// lower
					if((state[(b13+pos3+width3+x3-8)>>3])==0x40)	count = (count+1)|0;
					if((state[(b13+pos3+width3+x3)>>3])==0x40)		count = (count+1)|0;
					if((state[(b13+pos3+width3+x3+8)>>3])==0x40)	count = (count+1)|0;

					// check count of heads
					if(count==1) {
						state[(b23+pos3+x3)>>3] = 0x40;						
						// save list of changed cells
						chng[b3>>2] = x; b3 = (b3+4)|0;
						chng[b3>>2] = y; b3 = (b3+4)|0;
					} else if(count==2) {
						state[(b23+pos3+x3)>>3] = 0x40;
						// save list of changed cells
						chng[b3>>2] = x; b3 = (b3+4)|0;
						chng[b3>>2] = y; b3 = (b3+4)|0;
					} else if((state[(b23+pos3+x3)>>3]|0) != 0x23) {
						state[(b23+pos3+x3)>>3] = 0x23;
						// save list of changed cells
						chng[b3>>2] = x; b3 = (b3+4)|0;
						chng[b3>>2] = y; b3 = (b3+4)|0;
					}
				}
			}
		}
		// marker at end of changed cells
		chng[b3>>2] = 0; b3 = (b3+4)|0;
		chng[b3>>2] = 0; b3 = (b3+4)|0;
	}

	// exports
	return {
		wwStep:      wwStep,
	};
	
}