class ImageMaker extends NObject {
    _options: Options = null;
    _palette: IPalette = null;
    get Options(): Options {
        return this._options;
    }
    constructor(options: Options, palette: IPalette);
    constructor(options: Options);
    constructor(options: Options, palette?: IPalette) {
        super();
        if (arguments.length === 2 && (options === null || options instanceof Options)) {
            this.constructor_0(options, palette);
            return;
        }
        this.constructor_1(options);
    }
    private constructor_0(options: Options, palette: IPalette): void {
        var flag: boolean = options.Direction > ProcessingDirection.ToImage;
        if (flag) {
            throw new Exception("ImageMaker expects direction to be to image");
        }
        this._options = options;
        this._palette = palette;
    }
    private constructor_1(options: Options): void {
        this.constructor_0(options, new DefaultColorPalette(options.BitDepth));
    }
    Run(): void {
        var stream: Stream = File.OpenRead(this._options.InputFile);
        try {
            var image: Bitmap = this.GetImage(stream);
            image.Save(this._options.Outputfile, ImageFormat.Png);
        }
        finally {
            if (stream !== null) {
                (<IDisposable>stream).Dispose();
            }
        }
        var fileInfo: FileInfo = new FileInfo(this._options.Outputfile);
        NConsole.Out.WriteLine("Wrote file to " + fileInfo.FullName);
    }
    GetImage(stream: Stream): Bitmap {
        var bitArray: BitArray = this.BitArrayFromStream(stream);
        var pixels: IEnumerable<Color> = this.ColorsFromBits(bitArray);
        pixels = Tiler.Tile<Color>(pixels, this._options.TileMolesterMode, this._options.TileSize, this._options.TileSize, this._options.Width, this._palette.EOFColor);
        return this.ImageFromPixels(pixels, this._options.Width, this._options.Height);
    }
    ImageFromPixels(pixels: IEnumerable<Color>, width: number, height: number): Bitmap {
        var flag: boolean = height > -1;
        var bitmap: Bitmap = new Bitmap(width, flag ? height : (width * 20));
        var enumerator: IEnumerator<Color> = pixels.GetEnumerator();
        var flag2: boolean = true;
        var num: number = 0;
        while ((flag && num < bitmap.Height) || (!flag & flag2)) {
            for (var i: number = 0; i < bitmap.Width; i = i + 1) {
                var flag3: boolean = enumerator.MoveNext();
                var color: Color;
                if (flag3) {
                    color = enumerator.Current;
                }
                else {
                    flag2 = false;
                    color = this._palette.EOFColor;
                }
                bitmap.SetPixel(i, num, color);
            }
            num = num + 1;
            var flag4: boolean = num >= bitmap.Height && !flag;
            if (flag4) {
                break;
            }
        }
        var flag5: boolean = !flag;
        if (flag5) {
            bitmap = this.ResizeBitmap(bitmap, width, num);
        }
        return bitmap;
    }
    ResizeBitmap(bmp: Bitmap, desiredWidth: number, desiredHeight: number): Bitmap {
        var rect: Rectangle = new Rectangle(new Point(0, 0), new Size(desiredWidth, desiredHeight));
        return bmp.Clone(rect, bmp.PixelFormat);
    }
    ColorsFromBits(bitArray: BitArray): IEnumerable<Color> {
        var expr_07: ImageMaker__ColorsFromBits_d__10 = new ImageMaker__ColorsFromBits_d__10(-2);
        expr_07.__4__this = this;
        expr_07.__3__bitArray = bitArray;
        return expr_07;
    }
    BitArrayFromStream(stream: Stream): BitArray {
        var array: number[] = new Array<number>(stream.Length);
        for (var _ai: number = 0; _ai < array.length; ++_ai)
            array[_ai] = 0;
        stream.Read(array, 0, array.length);
        return new BitArray(array);
    }
    BitArrayFromFile(): BitArray {
        var fileStream: FileStream = File.OpenRead(this._options.InputFile);
        var result: BitArray;
        try {
            result = this.BitArrayFromStream(fileStream);
        }
        finally {
            if (fileStream !== null) {
                (<IDisposable>fileStream).Dispose();
            }
        }
        return result;
    }
}