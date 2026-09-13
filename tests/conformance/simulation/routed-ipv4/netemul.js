if (open) closeScene();
newScene();
stop();

var pc1 = addComputer(1, 1);
var pc2 = addComputer(5, 1);
var router = addRouter(3, 1);
router.router = true;
router.setSocketsCount(2);

addConnection(pc1, router, 'eth0', 'LAN1');
addConnection(pc2, router, 'eth0', 'LAN2');

pc1.setIp('eth0', '192.168.1.1');
pc1.setMask('eth0', '255.255.255.0');
pc1.setGateway('192.168.1.254');
router.setIp('LAN1', '192.168.1.254');
router.setMask('LAN1', '255.255.255.0');

pc2.setIp('eth0', '192.168.2.1');
pc2.setMask('eth0', '255.255.255.0');
pc2.setGateway('192.168.2.254');
router.setIp('LAN2', '192.168.2.254');
router.setMask('LAN2', '255.255.255.0');

pc1.sendMessage('192.168.2.1', 1, 0);
emulateTime();

var receivedPackets = pc2.receivePacketCount('eth0');
var result =
  '{"result":{"delivered":' +
  (receivedPackets > 0) +
  '},"details":{"receivedPackets":' +
  receivedPackets +
  '}}';
String(result);
