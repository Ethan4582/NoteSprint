const computer_network = [
  {
    id: 1,
    question: "What is an IP Address?",
    answer: "An Internet Protocol (IP) address is a unique numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication. It identifies the host or network interface and provides the location of the device."
  },
  {
    id: 2,
    question: "Explain the primary differences between TCP and UDP.",
    answer: "TCP (Transmission Control Protocol) is connection-oriented and ensures reliable, ordered delivery of data with error checking. UDP (User Datagram Protocol) is connectionless and faster as it lacks the overhead of reliability checks, making it ideal for real-time applications like streaming or gaming."
  },
  {
    id: 3,
    question: "What is Network?",
    answer: "An inter-connection of multiple devices known as host, that are connected using multiple paths for the purpose of sending/receiving data."
  },
  {
    id: 4,
    question: "Types of Networks",
    answer: "1. LAN (Local Area Network) [covers a small area like home, office, or school] 2. MAN (Metropolitan Area Network) [covers a larger area like a city] 3. WAN (Wide Area Network) [covers a large geographical area like a country] 4. PAN (Personal Area Network) [covers a small area around an individual]"
  },
  {
    id: 5,
    question: "Types of Network Topologies",
    answer: "1. Star -- Star topology is a network topology in which all the nodes are connected to a single device known as a central device\n2. Ring -- Ring topology is a network topology in which nodes are exactly connected to two or more nodes and thus, forming a single continuous path for the transmission.\n3. Bus -- Bus topology is a network topology in which all the nodes are connected to a single cable known as a central cable or bus.\n4. Mesh -- Mesh topology is a network topology in which all the nodes are individually connected to other nodes."
  }, {
    id: "6",
    question: "What is Bandwidth?",
    answer: "Bandwidth refers to the maximum amount of data that can be transmitted over a network connection in a given amount of time. It is typically measured in bits per second (bps)."
  }, {
    id: "7",
    question: "What is Latency?",
    answer: "Latency is the time it takes for a data packet to travel from its source to its destination in a network. It is typically measured in milliseconds (ms)."
  }, {
    id: "8",
    question: "What is VPN?",
    answer: "A VPN (Virtual Private Network) creates a secure, encrypted connection over a public network, allowing users to access resources as if they were directly connected to a private network."
  }, {
    id: "9",
    question: "What are Advantages of VPN?",
    answer: "VPN provides enhanced security and privacy by encrypting data, allows remote access to private networks, and helps bypass geo-restrictions."
  }, {
    id: "10",
    question: "What is IPv4 Address?",
    answer: "IPv4 (Internet Protocol version 4) is the fourth version of the Internet Protocol and is the most widely used IP addressing scheme. It is a 32-bit address space that can support up to 4.3 billion unique addresses."
  }, {
    id: "11",
    question: "What is IPv6 Address?",
    answer: "IPv6 (Internet Protocol version 6) is the latest version of the Internet Protocol and is the successor to IPv4. It is a 128-bit address space that can support up to 3.4 x 10^38 unique addresses."
  }, {
    id: "12",
    question: "What is MAC Address?",
    answer: "MAC (Media Access Control) Address is a unique identifier assigned to each network interface controller (NIC) for use as a network address in communications within a network segment. It is a unique 48-bits hardware number of a computer, which is embedded into network card"
  }, {
    id: "13",
    question: "What is DNS?",
    answer: "DNS (Domain Name System) is a hierarchical and distributed naming system for computers, services, or any resource connected to the Internet or a private network."
  }, {
    id: "14",
    question: "What is the Differences between IPv4 and IPv6?",
    answer: "1. Address Space: IPv4 is a 32-bit address space that can support up to 4.3 billion unique addresses. IPv6 is a 128-bit address space that can support up to 3.4 x 10^38 unique addresses. 2. Notation: IPv4 uses dotted decimal notation, while IPv6 uses hexadecimal notation. 3. Header Size: IPv4 has a larger header size than IPv6 4. Security: IPv6 has built-in security features that are not present in IPv. 5. Configuration: IPv6 has automatic configuration features that are not present in IPv4 "
  }, {
    id: "15",
    question: "What is TCP/IP Model?",
    answer: "TCP/IP (Transmission Control Protocol/Internet Protocol) model is a conceptual model that describes how data is transmitted over the Internet. It is a four-layer model that consists of the Application Layer, the Transport Layer, the Internet Layer, and the Network Access Layer."
  }, {
    id: "16",
    question: "What is HTTP and HTTPS",
    answer: "HTTP (Hypertext Transfer Protocol) is an application layer protocol used for transmitting hypermedia documents, such as HTML. HTTPS (Hypertext Transfer Protocol Secure) is a secure version of HTTP that uses encryption to protect data transmitted between a client and a server. HTTP runs on port 80, while HTTPS runs on port 443. HTTP is not secure, while HTTPS is secure."
  }, {
    id: "17",
    question: "What is Firewall?",
    answer: "The firewall is a network security system that is used to monitor the incoming and outgoing traffic and blocks the same based on the firewall security policies. It acts as a wall between the internet (public network) and the networking devices (a private network). It is either a hardware device, software program, or a combination of both. It adds a layer of security to the network."
  }, {
    id: "18",
    question: "What is OSI Model?",
    answer: "The OSI (Open Systems Interconnection) model is a conceptual model that describes how data is transmitted over the Internet. It is a seven-layer model that consists of the Physical Layer, the Data Link Layer, the Network Layer, the Transport Layer, the Session Layer, the Presentation Layer, and the Application Layer.",
    image: "/assets/theory/cn/18.png"
  }, {
    id: "19",
    question: "What is the Differences between TCP and UDP?",
    answer: "TCP is a connection-oriented protocol, while UDP is a connectionless protocol. TCP is reliable, while UDP is not reliable. TCP is slower than UDP, while UDP is faster than TCP. TCP is used for applications that require reliable data transmission, such as file transfer and email. UDP is used for applications that require fast data transmission, such as streaming and online gaming."
  }, {
    id: "20",
    question: "How does the UDP work?",
    answer: "UDP (User Datagram Protocol) is a connectionless protocol that operates on the Transport Layer of the TCP/IP model. Unlike TCP, it does not establish a connection before sending data, nor does it guarantee delivery, order, or error checking. It simply encapsulates the data into datagrams and sends them to the destination IP address and port number. The datagrams may arrive out of order or be lost entirely without any notification to the sender. This lack of overhead makes UDP much faster than TCP, making it suitable for time-sensitive applications where speed is prioritized over reliability."
  }, {
    id: "21",
    question: "How does the TCP work?",
    answer: "TCP (Transmission Control Protocol) is a connection-oriented protocol that operates on the Transport Layer of the TCP/IP model. It establishes a reliable connection between the sender and receiver through a three-way handshake process before data transmission begins. TCP ensures reliable data delivery through mechanisms like sequence numbers, acknowledgments, and flow control. It also retransmits lost or corrupted packets and manages the rate of data flow to prevent overwhelming the receiver. This reliability makes TCP suitable for applications where data integrity is critical, such as web browsing, file transfers, and email."
  }, {
    id: "22",
    question: "Explain three way handshake",
    answer: "Three-way handshake is a process used by TCP to establish a reliable connection between the sender and receiver. It involves three steps: SYN, SYN-ACK, and ACK. In the SYN step, the sender sends a SYN packet to the receiver to initiate the connection. In the SYN-ACK step, the receiver sends a SYN-ACK packet to the sender to acknowledge the connection. In the ACK step, the sender sends an ACK packet to the receiver to confirm the connection.",
  }, {
    id: "23",
    question: "Explain is layes in OSI model in detail",
    answer: "1.Physical Layer → Handles actual transmission of raw bits through cables, fiber optics, or wireless signals. Responsible for physical connection between devices. 2. Data Link Layer → Transfers data between directly connected devices using frames and MAC addresses. Also handles basic error detection/correction. 3.Network Layer → Handles logical addressing (IP) and routing packets between networks.Finds the best path from source to destination. 4. Transport Layer → Ensures reliable data delivery with error checking and flow control.Uses TCP (reliable) or UDP (fast, connectionless). 5. Session Layer → Starts, manages, and ends communication sessions between devices.Maintains connection state during communication. 6.Presentation Layer → Translates, encrypts, and compresses data between application and network formats.Makes data readable for different systems. 7. Application Layer → Closest layer to the user; provides network services like HTTP, FTP, DNS, SMTP.Enables applications to communicate over the network."
  }, {
    id: "24",
    question: "What happens when you hit an URL",
    answer: "1. A URL may contain a request to HTML, image file or any other type. 2. If the content of the typed URL is in the cache and fresh, then display the content. 3. Else find the IP address for the domain so that a TCP connection can be set up. Browser does a DNS lookup. 4. Browser needs to know the IP address for a URL so that it can set up a TCP connection. This is why browser needs DNS service. The browser first looks for URL-IP mapping browser cache, then in OS cache. If all caches are empty, then it makes a recursive query to the local DNS server. The local DNS server provides the IP address. 5. Browser sets up a TCP connection using three-way handshake. 6. Browser sends a HTTP request. 7. Server has a web server like Apache, IIS running that handles incoming HTTP request and sends an HTTP response. 8. Browser receives the HTTP response and renders the content."
  }, {
    id: "25",
    question: "What is DNS lookup",
    answer: "A DNS lookup is the process of translating a human-readable domain name (like google.com) into a machine-readable IP address (like [IP_ADDRESS]). It involves a series of steps where the browser first checks its local cache, then queries a series of DNS servers (recursive resolver, root, TLD, and authoritative) until it finds the correct IP address to connect to the website."
  }, {
    id: "26",
    question: "What is the SMTP protocol?",
    answer: "SMTP (Simple Mail Transfer Protocol) is an application layer protocol used for sending emails from a client to a server, or between servers. It uses TCP port 25 for communication and follows a client-server architecture. SMTP handles the reliable transfer of email messages across networks."
  }, {
    id: "27",
    question: "What is the FTP protocol?",
    answer: "FTP (File Transfer Protocol) is an application layer protocol used for transferring files between a client and a server. It uses TCP ports 20 and 21 for communication and follows a client-server architecture. FTP handles the reliable transfer of files across networks."
  }, {
    id: "28",
    question: "What is Client-Server Architecture?",
    answer: "Client-Server Architecture is a distributed application structure that partitions tasks or workloads between the providers of a resource or service, called servers, and service requesters, called clients. <br/><br/>In this architecture, the client initiates communication by sending a request to the server, and the server responds by providing the requested resource or service. The client and server are typically separate computers connected over a network, allowing for centralized management of resources and services."
  }, {
    id: "29",
    question: "What is the difference between a switch, router, and bridge?",
    answer: "Switch operates on Data Link Layer and forwards frames based on MAC addresses. It is used to connect devices within a single network. Router operates on Network Layer and forwards packets based on IP addresses. It is used to connect different networks. Bridge operates on Data Link Layer and connects two or more network segments, forwarding frames based on MAC addresses."
  }, {
    id: "30",
    question: "Differentiate between Latency and Bandwidth?",
    answer: "Latency is the time it takes for a data packet to travel from the source to the destination, while bandwidth is the maximum rate at which data can be transferred over a network. In simpler terms, latency is the delay, and bandwidth is the capacity."
  }, {
    id: "31",
    question: "What is a proxy server? Forward proxy vs reverse proxy?",
    answer: "A proxy server acts as an intermediary between a client and a server.<br/><br/> Forward proxy is used when the client wants to access a resource on the internet, and the server is the resource. Reverse proxy is used when the server wants to provide a resource to the client. In short, a forward proxy is used to protect the client, and a reverse proxy is used to protect the server. In a forward proxy, clients are behind the proxy, whereas in a reverse proxy, the server is behind the proxy.<br/><br/>Ex- Forward Proxy: corporate proxy server. Reverse Proxy: web server with load balancing. <br/><br/>In Forward Proxy: the proxy server is located between the user and the internet. In Reverse Proxy: the proxy server is located between the internet and the web server. "
  }, {
    id: "32",
    question: "What is NAT (Network Address Translation)? Why is it used?",
    answer: "NAT (Network Address Translation) is a process that allows multiple devices on a private network to share a single public IP address. <br/><br/> It is used to conserve public IP addresses and provide an additional layer of security by hiding the private IP addresses of devices on the network from the outside world."
  }, {
    id: "33",
    question: "What is CIDR? How does it work?",
    answer: "CIDR (Classless Inter-Domain Routing) is a method of allocating IP addresses and routing IP packets. <br/><br/> It allows for more efficient use of IP addresses by eliminating the need for classful networks and providing a way to summarize multiple IP addresses into a single routing entry. <br/><br/> Example: Consider a network with IP range [IP_ADDRESS]-. The subnet mask /20 indicates that the first 20 bits are used for the network portion and the last 12 bits for the host portion. This allows for 4096 possible addresses, with the first and last being reserved for network and broadcast addresses respectively, leaving 4094 usable addresses. ",
    image: "/assets/theory/cn/33.png"
  }, {
    id: "34",
    question: " What is IPv6? How is it different from IPv4?",
    answer: "Internet Protocol Version 6, or popularly called IPv6 is an updated version of IP addressing, and (might sound silly), but the main reason for its launch was because IPv4 ran out of addresses.Hence, IPv6 was introduced to solve this by using 128-bit addresses which were written in hexadecimal format:"
  }, {
    id: "35",
    question: "What is ARP protocol",
    answer: "ARP stands for Address Resolution Protocol.ARP is a protocol used in computer networks to find the MAC address of a device when the IP address is known.ARP is used in IPv4 networks, but not in IPv6 networks."
  }, {
    id: "36",
    question: "What kind of error is undetectable by the checksum?",
    answer: "The checksum can detect only an even number of bit errors. If there is an odd number of bit errors, the checksum will not detect the error and the packet will be accepted by the receiver."
  }, {
    id: "37",
    question: "What are the Advantages of Fiber Optics",
    answer: "Fiber optics has numerous advantages over traditional copper cables, including higher bandwidth, lower signal loss, immunity to electromagnetic interference, and increased security, making it the preferred choice for high-speed data transmission."
  }, {
    id: "38",
    question: "What is Multicast?",
    answer: "Multicast is a communication method that allows a single sender to transmit data to multiple recipients simultaneously. In multicast networking, data is sent to a specific group of receivers, rather than broadcasting to all devices on the network. This approach is widely used in applications such as video conferencing, online gaming, and live streaming."
  }, {
    id: "39",
    question: "Define the term Jitter?",
    answer: "Jitter is a variation in the delay of received packets. When packets arrive at the receiver with irregular timing, it can cause disruptions in real-time applications such as video conferencing and online gaming. Jitter can be caused by network congestion, routing issues, or other network impairments."
  }
];

export default computer_network;
