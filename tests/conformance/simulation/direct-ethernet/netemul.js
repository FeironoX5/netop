if (open) closeScene();
newScene();
stop();

var pc1 = addComputer(1, 1);
var pc2 = addComputer(3, 1);
addConnection(pc1, pc2, 'eth0', 'eth0');

pc1.setIp('eth0', '192.168.1.1');
pc1.setMask('eth0', '255.255.255.0');
pc2.setIp('eth0', '192.168.1.2');
pc2.setMask('eth0', '255.255.255.0');

pc1.sendMessage('192.168.1.2', 1, 0);
emulateTime();

var receivedPackets = pc2.receivePacketCount('eth0');
var result =
  '{"result":{"delivered":' +
  (receivedPackets > 0) +
  '},"details":{"receivedPackets":' +
  receivedPackets +
  '}}';
String(result);
