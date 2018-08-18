class BitArray extends NObject {
    //TODO implement or refactor away
    
    set_Item(arg0: number, value: boolean): any {
		throw new Error("Method not implemented.");
	}	Count: number;
	CopyTo(array: number[], arg1: number): any {
		throw new Error("Method not implemented.");
    }
    
    array: number[]
	constructor(array: number[]) {
		super();
		this.array = array
	}
    
}