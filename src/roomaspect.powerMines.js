const autopowerFlagRegex = /^autoPower([0-9]+)$/;
const colors = {
  bank: 3,
  scoop: 5,
  ruin: 6,
  drop: 7,
  enemy: 1,
};
module.exports = class PowerMinesAspect {
  constructor(roomai) {
    this.roomai = roomai;
    this.room = roomai.room;
    if (!this.room.memory.powerMines) this.room.memory.powerMines = [];
    if (!Memory.activeMines) Memory.activeMines = [];
    if (Memory.powerMinesLimit === undefined) Memory.powerMinesLimit = 0;
    this.powerMines = this.room.memory.powerMines;
  }

  run() {
    // console.log('pm')
    _.forEach(this.powerMines, (powerMine) => {
      let mineRoom = Game.rooms[powerMine];
      if (!mineRoom) return;
      let powerBank =
        mineRoom && mineRoom.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_POWER_BANK }).shift();
      let powerRuin = mineRoom && mineRoom.find(FIND_RUINS, { filter: (t) => _.sum(t.store) > 0 }).shift();
      let powerDroped =
        mineRoom && mineRoom.find(FIND_DROPPED_RESOURCES, { filter: (t) => t.resourceType === 'power' }).shift();

      let powerFlag =
        mineRoom &&
        mineRoom
          .find(FIND_FLAGS, {
            filter: (t) =>
              t.memory.type === 'power' && t.memory.support === this.room.name && t.memory.room === mineRoom.name,
          })
          .shift();

      // console.log('', this.room.name, mineRoom.name, powerBank, powerRuin, powerDroped, powerFlag);

      if (powerBank) {
        if (!powerFlag) {
          powerFlag = this.addFlag(this.room.name, mineRoom, powerBank.pos);
        }
        if (powerFlag) {
          if (powerBank.hits > 800) {
            powerFlag.memory.status = 'bank';
            powerFlag.setColor(colors['bank'],colors['bank']);
          } else {
            powerFlag.memory.status = 'scoop';
            powerFlag.setColor(colors['scoop'],colors['scoop']);
          }
        }
      }

      if (powerRuin) {
        if (!powerFlag) {
          powerFlag = this.addFlag(this.room.name, mineRoom, powerRuin.pos);
        }
        if (powerFlag) {
          powerFlag.memory.status = 'ruin';
          powerFlag.setColor(colors['ruin'],colors['ruin']);
        }
      }

      if (powerDroped) {
        if (!powerFlag) {
          powerFlag = this.addFlag(this.room.name, mineRoom, powerDroped.pos);
        }
        if (powerFlag) {
          powerFlag.memory.status = 'droped';
          powerFlag.setColor(colors['droped'],colors['droped']);
        }
      }

      if (!powerBank && !powerRuin && !powerDroped) {
        if (powerFlag) {
          console.log('remove', mineRoom.name, powerBank, powerRuin, powerDroped, powerFlag);
          this.removeFlag(powerFlag);
        }
      }

      if (!powerFlag) {
        Memory.activeMines = _.reject(Memory.activeMines, (r) => r.room === powerMine);
      }
    });

    if (this.roomai.observer.isAvailable() /* && Memory.activeMines.length < Memory.powerMinesLimit*/) {
      _.forEach(this.powerMines, (powerMine) => {
        let visible = Game.rooms[powerMine];
        if (!visible) {
          this.roomai.observer.observeLater(powerMine);
        }
      });
    }
  }
  addFlag(support, room, pos) {
    let cond = this.condition(room);
    // console.log(JSON.stringify(cond))
    if (cond) {
      let tryName = 'autoPower' + room.name;
      let flagName = room.createFlag(pos, tryName, 1, 1);
      // console.log('af', flagName)
      if (flagName === ERR_NAME_EXISTS) flagName = tryName;
      let powerFlag = Game.flags[flagName];
      // console.log('afo', powerFlag)
      powerFlag.memory.type = 'power';
      powerFlag.memory.support = support;
      powerFlag.memory.room = room.name;
      powerFlag.memory.id = this.getMineId();
      // Memory.activeMines = _.reject(Memory.activeMines, (r) => r.room === room.name);
      Memory.activeMines.push(powerFlag.memory);
      return powerFlag;
    }
  }
  removeFlag(powerFlag) {
    // this.room.memory.activeMines = _.reject(this.room.memory.activeMines, (r) => r.id === powerFlag.memory.id)
    powerFlag.remove();
  }
  condition(room) {
    let boosters = this.roomai.labs.getBoosters();
    // console.log(boosters)
    let minerBoost = _.find(boosters, (b) => b.resource === 'XUH2O' && b.isReady());
    let minerBoostCount = minerBoost && minerBoost.lab.store['XUH2O'];
    let healerBoost = _.find(boosters, (b) => b.resource === 'XLHO2' && b.isReady());
    let healerBoostCount = healerBoost && healerBoost.lab.store['XLHO2'];
    let scooperBoost = _.find(boosters, (b) => b.resource === 'XKH2O' && b.isReady());
    let scooperBoostCount = scooperBoost && scooperBoost.lab.store['XKH2O'];
    let routeFinder = new RouteFinder(this.room.name, room);
    let path = routeFinder.findRoute();
    let pathRooms = path.length;
    let distance = pathRooms * 50;
    let powerBank =
      room && room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_POWER_BANK }).shift();

    console.log(
      'cond',
      room,
      Memory.activeMines.length < Memory.powerMinesLimit,
      minerBoostCount >= 3000,
      healerBoostCount >= 3000,
      scooperBoostCount >= 3000,
      powerBank.ticksToDecay > 1000 + distance,
      powerBank.power > 3000
    );
    if (
      Memory.activeMines.length < Memory.powerMinesLimit &&
      minerBoostCount >= 3000 &&
      healerBoostCount >= 3000 &&
      scooperBoostCount >= 3000 &&
      powerBank.ticksToDecay > 1000 + distance &&
      powerBank.power > 3000
    ) {
      return true;
    }
    // return {distance: distance, ttd: powerBank.ticksToDecay, minerBoost: minerBoostCount, healerBoost:healerBoostCount, scooperBoost:scooperBoostCount }
  }
  getMineId() {
    if (this.room.memory.powerMinesCounter === undefined) this.room.memory.powerMinesCounter = 0;
    this.room.memory.powerMinesCounter += 1;
    return this.room.memory.powerMinesCounter;
  }
  addActiveMine(powerMine) {}
  removeActiveMine(powerMine) {}
};

const profiler = require('screeps-profiler');
const movement = require('./helper.movement');
const RouteFinder = require('./routefinder');
profiler.registerClass(module.exports, 'PowerMinesAspect');
