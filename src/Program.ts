export class Program {
    /**
     * Entry point of your web application.
     * Put your main code here
     */
    public static Main(): void {
        //$(document.body).append("Hello world");
        var canvas = <HTMLCanvasElement> document.getElementById('canvas');
        var canvasWidth = 512; //canvas.width;
        var canvasHeight = 512; //canvas.height;
        var ctx : any = canvas.getContext('2d',  { alpha: false });
        //var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

        var canvasFrame : any;
        var framerate = 26;

        function draw() {
            ctx.putImageData(canvasFrame, 0, 0);
        }
 
        var i = 0;

        setInterval(function() {
            canvasFrame = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            var data = canvasFrame.data;
            var param = i % 200;
            for (var y = 0; y < canvasHeight; ++y) {
                for (var x = 0; x < canvasWidth; ++x) {
                var index = (param*4 + y * canvasWidth + x) * 4;

                var value = x/2 * y/2 & 0xff;
                data[index] = value+param; // red
                data[++index] = value-param; // green
                data[++index] = value; // blue
                data[++index] = 255; // alpha
                }
            }
            i = i + 1;
            // frame is ready, draw it at next rAF
            requestAnimationFrame(draw);
        }, 1000 / framerate);

    }
}
