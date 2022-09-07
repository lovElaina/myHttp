# Implementing HTTP Protocol Based on Socket

1. Write a Client program to send get and post requests to HTTP Server. The request header fields can be set by yourself (including Accept-Charset, User-Agent, etc.).
2. Write the server-side presentation of the Web Server, receive the HTTP response and parse the response information. The response code contain at least 200 (success) and 404 (the webpage does not exist). (Client programs and server programs can be deployed on the same host).
After completing the above content, in addition to programming, clarify the system design process, such as client C design, server S design, and clarify the basic functions of the system, in addition to testing, and give the test environment, test cases, expected results and actual result.
I am going to implement a login registration system on the server side: the server side receives the user name and password from the client, if it matches the data item in the server's database, it will return the information indicating that the login is successful, if it does not match, it will return the information indicating the login Failed information. In the same way for the registration system, the server receives the user name and password to be registered from the client. If it has the same name as the data item in the server's database, it means that the user name has already been registered, and the registration failure information is returned. This person means that the user name has not been registered. At this time, the server adds the information from the client to the database and returns the registration success information. In addition, I also plan to add a forgotten password module, where users can retrieve their passwords with their usernames. In order to simplify the process, other verifications, such as mobile phone verification codes, have been removed. The client sends the username to be queried to the server, and the server searches the database for a match. If the match is successful, the response will include the password corresponding to the username and return it to the client. If there is no match, it means that the user input has If it is wrong, return the prompt message of query failure to the client.

Since I am learning node.js recently, I am going to use node as the underlying framework of the server. Node.js is an open source and cross-platform JavaScript runtime environment. It can run the V8 JavaScript engine outside the browser, making the overall performance very good, and because it is separated from the browser environment, it can also use node for client-side development.

**The HTTP protocol follows the specification of the TCP/IP protocol suite. It belongs to the application layer protocol in TCP/IP. It is based on the reliable TCP protocol. It processes the byte stream in the TCP communication and converts the byte stream into a meaningful HTTP protocol specification. .
Node's net module is used to create stream-based TCP or IPC servers, so in this experiment I will implement the HTTP protocol based on the net module.**

Package management tool: npm v6.14.15;
Project dependencies: Node.js v14.17.6;
     TypeScript v3.6.4;
     Ts-node v8.4.1;
      @types/node v18.0.0.
