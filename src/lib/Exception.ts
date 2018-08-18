class Exception extends NObject {
	Message: string;
	constructor(message: string = "") {
		super();
		this.Message = message;
	}
	ToString(): string {
		return "Exception: " + this.Message;
	}
}