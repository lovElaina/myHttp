import * as net from 'net';
import ResponseFormatter from './ResponseFormatter';

//HandleResponse类负责处理服务器发出的响应，它是resFormatter类的封装
class HandleResponse {
  //net调用底层Socket接口，实现数据传输的功能
  private socket: net.Socket;
  //ResponseFormatter负责设计响应报文结构
  private resFormatter: ResponseFormatter;

  //构造函数接收socket实例，并实例化响应报文格式
  constructor(socket: net.Socket) {
    this.socket = socket;
    this.resFormatter = new ResponseFormatter();
  }

  //以键值对的形式设置响应头
  public setHeader(key: string, val: string) {
    this.resFormatter.setHeader(key, val);
  }

  //设置其余响应头信息，例如状态，原因短语，响应体等
  public end(status: number, message: string, body: string) {
    const resFormatter = this.resFormatter;
    resFormatter.setStatus(status);
    resFormatter.setMessage(message);
    resFormatter.setBody(body);
    console.log("-------------服务端返回的响应报文为-------------");
    console.log(resFormatter.format())
    console.log("---------------------------------------------")
    //向socket发送数据，第二个参数为字符串编码，由于我们只使用英文，默认为utf-8，因此不需显式设置
    this.socket.write(resFormatter.format());
    this.socket.pipe(this.socket);
    //当socket另一端发送FIN包时，触发事件
    this.socket.end();
  }
}

export default HandleResponse;