///<reference path='system.drawing.ts'/>
///<reference path='mscorlib.ts'/>
///<reference path='Exception.ts'/>
import Color = System.Drawing.Color;
import Rectangle = System.Drawing.Rectangle;
import Point = System.Drawing.Point;
import Size = System.Drawing.Size;

class ImageMaker__ColorsFromBits_d__10 extends NObject implements IEnumerable<Color>, IEnumerator<Color>, IDisposable
{
	MoveNext(): boolean {
		//FIXME
		throw new Error("Method not implemented.");
	}

	private __1__state: number = 0;
	private __2__current: Color = null;
	private __l__initialThreadId: number = 0;
	private bitArray: BitArray = null;
	__3__bitArray: BitArray = null;
	__4__this: ImageMaker = null;
	private _bytes_5__1: number[] = null;
	private _accum_5__2: boolean[] = null;
	private _ptr_5__3: number = 0;
	private __s__4: number[] = null;
	private __s__5: number = 0;
	private _b_5__6: number = 0;
	private _i_5__7: number = 0;
	private _bit_5__8: boolean = false;
	get Current(): Color
	{
		return this.__2__current;
	}
	constructor(__1__state: number)
	{
		super();
		this.__1__state = __1__state;
		this.__l__initialThreadId = Environment.CurrentManagedThreadId;
	}
	Dispose(): void
	{
	}
	GetEnumerator(): IEnumerator<Color>
	{
		var _ColorsFromBits_d__: ImageMaker__ColorsFromBits_d__10;
		if (this.__1__state === -2 && this.__l__initialThreadId === Environment.CurrentManagedThreadId)
		{
			this.__1__state = 0;
			_ColorsFromBits_d__ = this;
		}
		else
		{
			_ColorsFromBits_d__ = new ImageMaker__ColorsFromBits_d__10(0);
			_ColorsFromBits_d__.__4__this = this.__4__this;
		}
		_ColorsFromBits_d__.bitArray = this.__3__bitArray;
		return _ColorsFromBits_d__;
	}
}
interface IReversePalette
{
	BinaryStreamFromPixels(colorData: IEnumerable<Color>): Stream;
}
class DynamicReversePalette extends NObject implements IReversePalette
{
	private _dict: Dictionary<Color, boolean[]> = null;
	private _bitDepth: number = 0;
	private _EOFColor: Color = null;
	private static _values: IEnumerable<boolean[]> = null;
	constructor(bitDepth: number, values: IEnumerable<boolean[]>);
	constructor(bitDepth: number);
	constructor(bitDepth: number, values?: IEnumerable<boolean[]>)
	{
		super();
		if (arguments.length === 2 && (bitDepth === null || bitDepth.constructor === Number))
		{
			this.constructor_0(bitDepth, values);
			return;
		}
		this.constructor_1(bitDepth);
	}
	private constructor_0(bitDepth: number, values: IEnumerable<boolean[]>): void
	{
		this._dict = new Dictionary<Color, boolean[]>();
		this._bitDepth = bitDepth;
		DynamicReversePalette._values = values;
	}
	private constructor_1(bitDepth: number): void
	{
		var expr_08: boolean[][] = new Array<boolean>(4);
		expr_08[0] = new Array<boolean>(2);
		for (var _ai: number = 0; _ai < expr_08[0].length; ++_ai)
			expr_08[0][_ai] = false;
		expr_08[1] = [
			false, true
		];
		var arg_2A_1: number = 2;
		var expr_26: boolean[] = new Array<boolean>(2);
		expr_26[0] = true;
		expr_08[arg_2A_1] = expr_26;
		expr_08[3] = [
			true, true
		];
		this..ctor(bitDepth, NArray.ToEnumerable(expr_08));
	}
	BinaryStreamFromPixels(colorData: IEnumerable<Color>): Stream
	{
		var memoryStream: MemoryStream = new MemoryStream();
		var binaryWriter: BinaryWriter = new BinaryWriter(memoryStream, Encoding.UTF8);
		var num: number = 7;
		var bitArray: BitArray = new BitArray(8);
		var enumerator: IEnumerator<Color> = colorData.GetEnumerator();
		try
		{
			while (enumerator.MoveNext())
			{
				var current: Color = enumerator.Current;
				var flag: boolean = !this._dict.ContainsKey(current);
				if (flag)
				{
					this.AddColorMapping(current);
				}
				var flag2: boolean = NObject.GenericEquals(current, this._EOFColor);
				if (flag2)
				{
					break;
				}
				var array: boolean[] = this._dict.get_Item(current);
				for (var i: number = 0; i < array.length; i = i + 1)
				{
					var value: boolean = array[i];
					bitArray.set_Item(num--, value);
					var flag3: boolean = num < 0;
					if (flag3)
					{
						binaryWriter.Write(DynamicReversePalette.ConvertToByte(bitArray));
						num = 7;
					}
				}
			}
		}
		finally
		{
			if (enumerator !== null)
			{
				enumerator.Dispose();
			}
		}
		return memoryStream;
	}
	private AddColorMapping(pixel: Color): void
	{
		var bitDepth: number = this._bitDepth;
		if (bitDepth !== 2)
		{
			throw new NotImplementedException();
		}
		var enumerator: IEnumerator<boolean[]> = DynamicReversePalette._values.GetEnumerator();
		try
		{
			while (enumerator.MoveNext())
			{
				var current: boolean[] = enumerator.Current;
				var flag: boolean = !this._dict.ContainsValue(current);
				if (flag)
				{
					this._dict.Add(pixel, current);
					break;
				}
			}
		}
		finally
		{
			if (enumerator !== null)
			{
				enumerator.Dispose();
			}
		}
		var flag2: boolean = !this._dict.ContainsKey(pixel);
		if (flag2)
		{
			this._EOFColor = pixel;
		}
	}
	private static ConvertToByte(bits: BitArray): number
	{
		var flag: boolean = bits.Count !== 8;
		if (flag)
		{
			throw new ArgumentException("length of bitarray is not expected");
		}
		var array: number[] = new Array<number>(1);
		for (var _ai: number = 0; _ai < array.length; ++_ai)
			array[_ai] = 0;
		bits.CopyTo(array, 0);
		return array[0];
	}
}
class ColorToBitReversePalette extends NObject implements IReversePalette
{
	private _dict: Dictionary<Color, boolean> = null;
	private _EOFColor: Color = null;
	constructor()
	{
		super();
		this._dict = new Dictionary<Color, boolean>();
		this._dict.set_Item(Color.FromArgb(255, 0, 0, 0), false);
		this._dict.set_Item(Color.FromArgb(255, 127, 127, 127), false);
		this._dict.set_Item(Color.FromArgb(255, 160, 64, 32), true);
		this._EOFColor = Color.FromArgb(255, 123, 127, 127);
	}
	BinaryStreamFromPixels(colorData: IEnumerable<Color>): Stream
	{
		var memoryStream: MemoryStream = new MemoryStream();
		var binaryWriter: BinaryWriter = new BinaryWriter(memoryStream, Encoding.Unicode);
		var num: number = 7;
		var bitArray: BitArray = new BitArray(8);
		var enumerator: IEnumerator<Color> = colorData.GetEnumerator();
		try
		{
			while (enumerator.MoveNext())
			{
				var current: Color = enumerator.Current;
				var flag: boolean = NObject.GenericEquals(current, this._EOFColor);
				if (flag)
				{
					break;
				}
				bitArray.set_Item(num--, this._dict.get_Item(current));
				var flag2: boolean = num < 0;
				if (flag2)
				{
					binaryWriter.Write(ColorToBitReversePalette.ConvertToByte(bitArray));
					num = 7;
				}
			}
		}
		finally
		{
			if (enumerator !== null)
			{
				enumerator.Dispose();
			}
		}
		return memoryStream;
	}
	private static ConvertToByte(bits: BitArray): number
	{
		var flag: boolean = bits.Count !== 8;
		if (flag)
		{
			throw new ArgumentException("length of bitarray is not expected");
		}
		var array: number[] = new Array<number>(1);
		for (var _ai: number = 0; _ai < array.length; ++_ai)
			array[_ai] = 0;
		bits.CopyTo(array, 0);
		return array[0];
	}
}
enum ProcessingDirection
{
	ToImage,
	ToBinary
}
class Program extends NObject
{
	private static Configure(args: Stack<string>): Options
	{
		var args2: string[] = args.ToArray();
		var options: Options = new Options();
		var flag: boolean = !Parser.Default.ParseArguments(args2, options);
		var result: Options;
		if (flag)
		{
			result = null;
		}
		else
		{
			var flag2: boolean = !File.Exists(options.InputFile);
			if (flag2)
			{
				NConsole.Out.WriteLine("Couldn't find input file " + options.InputFile);
				result = null;
			}
			else
			{
				result = options;
			}
		}
		return result;
	}
	private static Main(args: string[]): void
	{
		var options: Options = Program.Configure(new Stack<string>(Enumerable.Reverse<string>(NArray.ToEnumerable(args))));
		var flag: boolean = options === null;
		if (!flag)
		{
			var hasValue: boolean = options.NumColorsToUse !== null;
			var palette: IPalette;
			if (hasValue)
			{
				NConsole.Out.WriteLine("Using Unbalanced Color palette, with " + options.BitDepth + " bit depth");
				palette = new UnbalancedPalette(options.BitDepth, options.NumColorsToUse.Value);
			}
			else
			{
				NConsole.Out.WriteLine("Using Default Color palette, " + options.BitDepth + " bit depth");
				palette = new DefaultColorPalette(options.BitDepth);
			}
			var fileInfo: FileInfo = new FileInfo(options.Outputfile);
			var exists: boolean = fileInfo.Exists;
			if (exists)
			{
				NConsole.Out.WriteLine("File " + fileInfo + " exists already");
				var deleteOutputFile: boolean = options.DeleteOutputFile;
				if (!deleteOutputFile)
				{
					return;
				}
				NConsole.Out.WriteLine("Deleting " + fileInfo + " because -d specified..");
				fileInfo.Delete();
				fileInfo = new FileInfo(options.Outputfile);
			}
			var flag2: boolean = options.Direction === ProcessingDirection.ToImage;
			if (flag2)
			{
				var imageMaker: ImageMaker = new ImageMaker(options, palette);
				imageMaker.Run();
			}
			else
			{
				var binaryMaker: BinaryMaker = new BinaryMaker(options, palette);
				binaryMaker.Run();
			}
			var flag3: boolean = File.Exists(options.Outputfile);
			if (flag3)
			{
				Process.Start(options.Outputfile);
			}
		}
	}
	constructor()
	{
		super();
	}
}
class BinaryMaker extends NObject
{
	_options: Options = null;
	_palette: IPalette = null;
	get Options(): Options
	{
		return this._options;
	}
	constructor(options: Options, palette: IPalette)
	{
		super();
		this._options = options;
		this._palette = palette;
	}
	Run(): void
	{
		var image: Image = Image.FromFile(this._options.InputFile, true);
		var fileStream: FileStream = File.OpenRead(this._options.InputFile);
		try
		{
			var stream: Stream = this.Reverse(fileStream);
			this.WriteBinaryStreamToFile(stream);
		}
		finally
		{
			if (fileStream !== null)
			{
				(<IDisposable>fileStream).Dispose();
			}
		}
		var fileInfo: FileInfo = new FileInfo(this._options.Outputfile);
		NConsole.Out.WriteLine("Wrote file to " + fileInfo.FullName);
	}
	Reverse(imageData: Stream): Stream
	{
		var image: Image = Image.FromStream(imageData);
		var pixels: IEnumerable<Color> = this.GetPixels(image);
		pixels = Tiler.Untile<Color>(pixels, 8, 8, image.Width);
		return this.BinaryStreamFromPixels(pixels);
	}
	WriteBinaryStreamToFile(stream: Stream): void
	{
		var fileStream: FileStream = File.Create(this._options.Outputfile);
		try
		{
			stream.Seek(0, SeekOrigin.Begin);
			stream.CopyTo(fileStream);
		}
		finally
		{
			if (fileStream !== null)
			{
				(<IDisposable>fileStream).Dispose();
			}
		}
	}
	BinaryStreamFromPixels(pixels: IEnumerable<Color>): Stream
	{
		var memoryStream: MemoryStream = new MemoryStream();
		var binaryWriter: BinaryWriter = new BinaryWriter(memoryStream);
		var enumerator: IEnumerator<number> = this.BytesFromPixels(pixels).GetEnumerator();
		try
		{
			while (enumerator.MoveNext())
			{
				var current: number = enumerator.Current;
				binaryWriter.Write(current);
			}
		}
		finally
		{
			if (enumerator !== null)
			{
				enumerator.Dispose();
			}
		}
		return memoryStream;
	}
	BytesFromPixels(pixels: IEnumerable<Color>): IEnumerable<number>
	{
		var expr_07: BinaryMaker__BytesFromPixels_d__9 = new BinaryMaker__BytesFromPixels_d__9(-2);
		expr_07.__4__this = this;
		expr_07.__3__pixels = pixels;
		return expr_07;
	}
	static ConvertToByte(bits: BitArray): number
	{
		var flag: boolean = bits.Count !== 8;
		if (flag)
		{
			throw new ArgumentException("length of bitarray is not expected");
		}
		var array: number[] = new Array<number>(1);
		for (var _ai: number = 0; _ai < array.length; ++_ai)
			array[_ai] = 0;
		bits.CopyTo(array, 0);
		return array[0];
	}
	GetPixels(image: Image): IEnumerable<Color>
	{
		var expr_07: BinaryMaker__GetPixels_d__11 = new BinaryMaker__GetPixels_d__11(-2);
		expr_07.__4__this = this;
		expr_07.__3__image = image;
		return expr_07;
	}
}
class BinaryMaker__GetPixels_d__11 extends NObject implements IEnumerable<Color>, IEnumerator<Color>, IDisposable
{
	private __1__state: number = 0;
	private __2__current: Color = null;
	private __l__initialThreadId: number = 0;
	private image: Image = null;
	__3__image: Image = null;
	__4__this: BinaryMaker = null;
	private _x_5__1: number = 0;
	private _y_5__2: number = 0;
	private _bmp_5__3: Bitmap = null;
	private _pixelColor_5__4: Color = null;
	get Current(): Color
	{
		return this.__2__current;
	}
	constructor(__1__state: number)
	{
		super();
		this.__1__state = __1__state;
		this.__l__initialThreadId = Environment.CurrentManagedThreadId;
	}
	Dispose(): void
	{
	}
	GetEnumerator(): IEnumerator<Color>
	{
		var _GetPixels_d__: BinaryMaker__GetPixels_d__11;
		if (this.__1__state === -2 && this.__l__initialThreadId === Environment.CurrentManagedThreadId)
		{
			this.__1__state = 0;
			_GetPixels_d__ = this;
		}
		else
		{
			_GetPixels_d__ = new BinaryMaker__GetPixels_d__11(0);
			_GetPixels_d__.__4__this = this.__4__this;
		}
		_GetPixels_d__.image = this.__3__image;
		return _GetPixels_d__;
	}
}
class BinaryMaker__BytesFromPixels_d__9 extends NObject implements IEnumerable<number>, IEnumerator<number>, IDisposable
{
	private __1__state: number = 0;
	private __2__current: number = 0;
	private __l__initialThreadId: number = 0;
	private pixels: IEnumerable<Color> = null;
	__3__pixels: IEnumerable<Color> = null;
	__4__this: BinaryMaker = null;
	private _ptr_5__1: number = 0;
	private _bits_5__2: BitArray = null;
	private __s__3: IEnumerator<Color> = null;
	private _pixel_5__4: Color = null;
	private _data_5__5: boolean[] = null;
	private __s__6: boolean[] = null;
	private __s__7: number = 0;
	private _datum_5__8: boolean = false;
	get Current(): number
	{
		return this.__2__current;
	}
	constructor(__1__state: number)
	{
		super();
		this.__1__state = __1__state;
		this.__l__initialThreadId = Environment.CurrentManagedThreadId;
	}
	Dispose(): void
	{
		var num: number = this.__1__state;
		if (num === -3 || num === 1)
		{
			try
			{
			}
			finally
			{
				this.__m__Finally1();
			}
		}
	}
	private __m__Finally1(): void
	{
		this.__1__state = -1;
		if (this.__s__3 !== null)
		{
			this.__s__3.Dispose();
		}
	}
	GetEnumerator(): IEnumerator<number>
	{
		var _BytesFromPixels_d__: BinaryMaker__BytesFromPixels_d__9;
		if (this.__1__state === -2 && this.__l__initialThreadId === Environment.CurrentManagedThreadId)
		{
			this.__1__state = 0;
			_BytesFromPixels_d__ = this;
		}
		else
		{
			_BytesFromPixels_d__ = new BinaryMaker__BytesFromPixels_d__9(0);
			_BytesFromPixels_d__.__4__this = this.__4__this;
		}
		_BytesFromPixels_d__.pixels = this.__3__pixels;
		return _BytesFromPixels_d__;
	}
}
class Tiler extends NObject
{
	static Tile<T>(pixels: IEnumerable<T>, tileMolesterMode: boolean, tileWidth: number, tileHeight: number, width: number, eofValue: T): IEnumerable<T>
	{
		var expr_07: Tiler__Tile_d__0<T> = new Tiler__Tile_d__0<T>(-2);
		expr_07.__3__pixels = pixels;
		expr_07.__3__tileMolesterMode = tileMolesterMode;
		expr_07.__3__tileWidth = tileWidth;
		expr_07.__3__tileHeight = tileHeight;
		expr_07.__3__width = width;
		expr_07.__3__eofValue = eofValue;
		return expr_07;
	}
	static Untile<T>(pixels: IEnumerable<T>, tileWidth: number, tileHeight: number, width: number): IEnumerable<T>
	{
		var expr_07: Tiler__Untile_d__1<T> = new Tiler__Untile_d__1<T>(-2);
		expr_07.__3__pixels = pixels;
		expr_07.__3__tileWidth = tileWidth;
		expr_07.__3__tileHeight = tileHeight;
		expr_07.__3__width = width;
		return expr_07;
	}
	constructor()
	{
		super();
	}
}
class Tiler__Untile_d__1<T> extends NObject implements IEnumerable<T>, IEnumerator<T>, IDisposable
{
	private __1__state: number = 0;
	private __2__current: T = null;
	private __l__initialThreadId: number = 0;
	private pixels: IEnumerable<T> = null;
	__3__pixels: IEnumerable<T> = null;
	private tileWidth: number = 0;
	__3__tileWidth: number = 0;
	private tileHeight: number = 0;
	__3__tileHeight: number = 0;
	private width: number = 0;
	__3__width: number = 0;
	private _tilesAcross_5__1: number = 0;
	private _pixelData_5__2: T[,,] = null;
	private _tilePtr_5__3: number = 0;
	private _whichRowPtr_5__4: number = 0;
	private _inRowPtr_5__5: number = 0;
	private __s__6: IEnumerator<T> = null;
	private _pixel_5__7: T = null;
	private _tile_5__8: number = 0;
	private _row_5__9: number = 0;
	private _col_5__10: number = 0;
	get Current(): T
	{
		return this.__2__current;
	}
	constructor(__1__state: number)
	{
		super();
		this.__1__state = __1__state;
		this.__l__initialThreadId = Environment.CurrentManagedThreadId;
	}
	Dispose(): void
	{
		var num: number = this.__1__state;
		if (num === -3 || num === 1)
		{
			try
			{
			}
			finally
			{
				this.__m__Finally1();
			}
		}
	}
	private __m__Finally1(): void
	{
		this.__1__state = -1;
		if (this.__s__6 !== null)
		{
			this.__s__6.Dispose();
		}
	}
	GetEnumerator(): IEnumerator<T>
	{
		var _Untile_d__: Tiler__Untile_d__1<T>;
		if (this.__1__state === -2 && this.__l__initialThreadId === Environment.CurrentManagedThreadId)
		{
			this.__1__state = 0;
			_Untile_d__ = this;
		}
		else
		{
			_Untile_d__ = new Tiler__Untile_d__1<T>(0);
		}
		_Untile_d__.pixels = this.__3__pixels;
		_Untile_d__.tileWidth = this.__3__tileWidth;
		_Untile_d__.tileHeight = this.__3__tileHeight;
		_Untile_d__.width = this.__3__width;
		return _Untile_d__;
	}
}
class Tiler__Tile_d__0<T> extends NObject implements IEnumerable<T>, IEnumerator<T>, IDisposable
{
	private __1__state: number = 0;
	private __2__current: T = null;
	private __l__initialThreadId: number = 0;
	private pixels: IEnumerable<T> = null;
	__3__pixels: IEnumerable<T> = null;
	private tileMolesterMode: boolean = false;
	__3__tileMolesterMode: boolean = false;
	private tileWidth: number = 0;
	__3__tileWidth: number = 0;
	private tileHeight: number = 0;
	__3__tileHeight: number = 0;
	private width: number = 0;
	__3__width: number = 0;
	private eofValue: T = null;
	__3__eofValue: T = null;
	private _tilesAcross_5__1: number = 0;
	private _pixelData_5__2: T[,] = null;
	private _tile_5__3: number = 0;
	private _row_5__4: number = 0;
	private _col_5__5: number = 0;
	private _bufferCount_5__6: number = 0;
	private __s__7: IEnumerator<T> = null;
	private _pixel_5__8: T = null;
	private _x_5__9: number = 0;
	private _y_5__10: number = 0;
	private _x_5__11: number = 0;
	private _y_5__12: number = 0;
	private _flushCount_5__13: number = 0;
	private _y_5__14: number = 0;
	private _x_5__15: number = 0;
	get Current(): T
	{
		return this.__2__current;
	}
	constructor(__1__state: number)
	{
		super();
		this.__1__state = __1__state;
		this.__l__initialThreadId = Environment.CurrentManagedThreadId;
	}
	Dispose(): void
	{
		var num: number = this.__1__state;
		if (num === -3 || num === 1)
		{
			try
			{
			}
			finally
			{
				this.__m__Finally1();
			}
		}
	}
	private __m__Finally1(): void
	{
		this.__1__state = -1;
		if (this.__s__7 !== null)
		{
			this.__s__7.Dispose();
		}
	}
	GetEnumerator(): IEnumerator<T>
	{
		var _Tile_d__: Tiler__Tile_d__0<T>;
		if (this.__1__state === -2 && this.__l__initialThreadId === Environment.CurrentManagedThreadId)
		{
			this.__1__state = 0;
			_Tile_d__ = this;
		}
		else
		{
			_Tile_d__ = new Tiler__Tile_d__0<T>(0);
		}
		_Tile_d__.pixels = this.__3__pixels;
		_Tile_d__.tileMolesterMode = this.__3__tileMolesterMode;
		_Tile_d__.tileWidth = this.__3__tileWidth;
		_Tile_d__.tileHeight = this.__3__tileHeight;
		_Tile_d__.width = this.__3__width;
		_Tile_d__.eofValue = this.__3__eofValue;
		return _Tile_d__;
	}
}
class Utils extends NObject
{
	static IntFromBools(data: boolean[]): number
	{
		var arg_22_1: number = 0;
		var arg_22_2: (arg1: number, arg2: boolean) => number;
		if ((arg_22_2 = Utils___c.__9__0_0) === null)
		{
			arg_22_2 = (Utils___c.__9__0_0 = Utils___c.__9._IntFromBools_b__0_0);
		}
		return Enumerable.Aggregate<boolean, number>(NArray.ToEnumerable(data), arg_22_1, arg_22_2);
	}
	static BoolsFromInt(datum: number, bitDepth: number): boolean[]
	{
		var list: List<boolean> = new List<boolean>();
		while (bitDepth > 0)
		{
			var item: boolean = datum % 2 === 1;
			list.Add(item);
			datum = datum / 2;
			bitDepth = bitDepth - 1;
		}
		list.Reverse();
		return list.ToArray();
	}
	constructor()
	{
		super();
	}
}
class Utils___c extends NObject
{
	static __9: Utils___c = new Utils___c();
	static __9__0_0: (arg1: number, arg2: boolean) => number = null;
	_IntFromBools_b__0_0(current: number, b: boolean): number
	{
		return current << 1 | (b ? 1 : 0);
	}
	constructor()
	{
		super();
	}
}
