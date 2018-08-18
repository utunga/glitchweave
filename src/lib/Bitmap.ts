///<reference path='system.drawing.ts'/>
import Color = System.Drawing.Color;
import Rectangle = System.Drawing.Rectangle;
import Point = System.Drawing.Point;
import Size = System.Drawing.Size;

class Bitmap extends NObject {
	Save(Outputfile: string, Png: any): any {
		throw new Error("Method not implemented.");
	}
	Clone(rect: Rectangle, PixelFormat: any): any {
		throw new Error("Method not implemented.");
	}
	PixelFormat(rect: Rectangle, PixelFormat: any): any {
		throw new Error("Method not implemented.");
	}
	SetPixel(i: number, num: number, color: Color): any {
		throw new Error("Method not implemented.");
	}
    //TODO implement or refactor away
    Width: number;
    Height: number;

    constructor(width: number=0, height: number=0) {
        super();
        this.Width = width;
        this.Height = height;
    }
}