// Memory.rooms['W29S13'].constructions = {};
Memory.rooms['W29S13'].constructions.scalableExtensions= [{x: 12, y: 11, width: 10, height: 10}];
Memory.rooms['W29S13'].constructions.spawn[0]={x:14,y:13};
Memory.rooms['W29S13'].constructions.spawn[1]={x:16,y:15};
Memory.rooms['W29S13'].constructions.spawn[2]={x:18,y:17};
// Memory.rooms['W29S13'].constructions.storage[0]={x:24,y:24,dir:1};
// Memory.rooms['W29S13'].constructions.reactor[0]={x:28,y:20,dir:4};
// Memory.rooms['W29S13'].constructions.towerStack[0] = {x:20,y:7, dir: 2};
// Memory.rooms['W29S13'].constructions.terminal[0]={x:27,y:24};
Memory.rooms['W29S13'].constructions.store[0]={x:44,y:36,link:true};
Memory.rooms['W29S13'].constructions.store[1]={x:7,y:22,link:true};
// Memory.rooms['W29S13'].constructions.store[2]={x:37,y:19,link:true};
// Memory.rooms['W29S13'].constructions.store[2]={x:42,y:41,link:true};
// Memory.rooms['W29S13'].constructions.store[3]={x:42,y:41,link:true};
// Memory.rooms['W29S13'].constructions.stack[0]={x:16,y:7,dir:1,locations:{center: 'link',left:'powerSpawn',right:'terminal'}};

Memory.friendList = [];
Memory.friendList.push('MaxWagner');
Memory.friendList.push('MonstrikSupra');
Memory.friendList.push('DISconnect24');
Memory.friendList.push('MxxWg');

Game.spawns.Spawn1.createCreep(Array(1).fill(CARRY).concat(Array(1).fill(MOVE)).concat(Array(2).fill(WORK)),'builder-'+Game.time,{"role":"builder", room: 'W29S13', renew: true});