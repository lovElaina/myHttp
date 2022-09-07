import { Headers } from './HttpParser';

//ResponseFormatter负责设计响应报文结构
class ResponseFormatter {
  //响应状态，默认为200
  private status: number = 200;
  //原因短语，需要自行设置，例如200为ok，404为not found
  private message: string = '';
  //协议版本，默认使用HTTP/1.1
  private version: string = 'HTTP/1.1';
  //响应头部信息，这里先只设置文档类型为text/plain，后续可以使用setHeader追加设置
  private headers: Headers = null;
  //响应体信息，暂时置为空，需要时通过传参设置
  private body: string = '';

  //构造函数只需设置头部文档类型，也可以直接放到属性定义部分
  constructor() {
    this.headers = {
      'Content-Type': 'text/plain'
    };
  }

  //设置状态信息，例如200，404等
  public setStatus(status: number) {
    this.status = status;
  }

  //设置原因短语，例如ok，not found等
  public setMessage(message: string){
    this.message = message;
  }

  //设置响应体，用于做其他说明，客户端可以使用res.data进行接收
  public setBody(body: string) {
    this.body = body;
  }

  //设置其余响应头，例如若想实现跨域，则需要设置"Access-Control-Allow-Origin"属性
  public setHeader(key: string, val: string) {
    this.headers[key] = val;
  }

  //format函数的作用是序列化响应报文，以字符串形式返回
  public format(): string {
    //这里的``为es6新增的模板字符串，可以方便地进行字符串拼接和其它处理
    const head = `${this.version} ${this.status} ${this.message}`;
    let headers = '';
    for (let key in this.headers) {
      const value = this.headers[key];
      //头部信息一律小写
      headers += `${key.toLocaleLowerCase()}: ${value}\r\n`;
    }
    //join函数可以以join函数的参数进行数组分割，最终返回字符串，例如 xxx\r\nyyy\r\nzzz
    const combineData = [head, headers, this.body].join('\r\n');
    return combineData;
  }
}

export default ResponseFormatter;