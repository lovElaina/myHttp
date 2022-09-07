export type Headers = { [key: string]: string };

//定义亲求报文对象属性
export type HttpMessage = {
  method: string; //请求方法，例如get或post
  url: string; //统一资源标识符，例如/login
  version: string; //Http协议版本，例如Http1.1
  headers: Headers; //请求头，与下面请求体之间有一行空行
  body: string; //请求体
}
//HttpParser类用于从请求报文字符串中提取数据，并反序列化为对象
class HttpParser {
  //message为待转化的字符串
  private message: string;
  //httpMessage为以对象形式呈现的请求报文，也是这个类的主要目标
  public httpMessage: HttpMessage = null;

  //构造函数中传入代转换的字符串，并使用parse函数进行处理
  constructor(message: string) {
    this.message = message;
    this.parse();
  }

  //总体转化函数，其内部存在分别处理请求行，请求头，请求体的函数
  private parse(): void {
    this.httpMessage = {} as HttpMessage;
    //按照'\r\n'分割字符串为数组，例如：aaa\r\nbbb，分割后变为[aaa,bbb]
    const messages = this.message.split('\r\n');
    //取第一项为请求行
    const [head] = messages;
    //取第一项之后，倒数第二项之前的所有项，作为请求头
    const headers = messages.slice(1, -2);
    //取最后一项为请求体
    const [body] = messages.slice(-1);
    this.parseHead(head);
    this.parseHeaders(headers);
    this.parseBody(body);
  }

  //对拆分的请求行做进一步处理，进行反序列化
  private parseHead(headStr: string) {
    const [method, url, version] = headStr.split(' ');
    this.httpMessage.method = method;
    this.httpMessage.url = url;
    this.httpMessage.version = version;
  }

  //对拆分的请求头做进一步处理，进行反序列化
  private parseHeaders(headerStrList: string[]) {
    this.httpMessage.headers = {};
    for (let i = 0; i < headerStrList.length; i++) {
      const header = headerStrList[i];
      let [key, value] = header.split(":");
      key = key.toLocaleLowerCase();
      value = value.trim();
      this.httpMessage.headers[key] = value;
    }
  }

  //对拆分的请求体做进一步处理，进行反序列化
  private parseBody(bodyStr: string) {
    if (!bodyStr) return this.httpMessage.body = "";
    this.httpMessage.body = bodyStr;
  }
}

export default HttpParser;