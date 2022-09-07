import HttpParser, { HttpMessage } from "./HttpParser";
//请求报文传输的包装类
class TransRequest {
  private httpParser: HttpParser;
  public httpMessage: HttpMessage;
  //构造函数，传入的参数为
  constructor(message: string) {
    //从序列化请求报文字符串反序列化为对象，存入httpParser类的实例对象中
    this.httpParser = new HttpParser(message);
    //拿到httpParser类的httpMessage对象句柄，之后可以使用TransRequest.httpMessage来获取请求对象
    this.httpMessage = this.httpParser.httpMessage;
  }
}

export default TransRequest;