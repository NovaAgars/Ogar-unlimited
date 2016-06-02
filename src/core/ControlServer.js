'use strict';
// This is the main server process that should only ever be called once. It creates and controls the other servers
// as well as controls the communication between them and shares data

const WorldModel = require('./WorldModel');
const GameServer = require('./GameServer');
const ConsoleService = require('./ConsoleService.js');
const Updater = require('./Updater.js');
//let updater = new Updater(this);
const ConfigService = require('./ConfigService.js');
'use strict';
module.exports = class ControlServer {
  constructor(version, multiverse, port, ismaster, name, configService, banned, gamemode, title) {
    // fields
    //this.consoleStreams = {};
    this.servers = [];
    this.name = name;
    this.title = title;
    this.gamemode = gamemode;
this.port = port;
this.configService = new ConfigService(ismaster); // we need the config service first so we can setup other services / servers
this.configService.load()
this.isMaster = ismaster;
    // share data
this.config = this.configService.getConfig();
this.world = new WorldModel(this.config.borderRight, this.config.borderLeft, this.config.borderBottom, this.config.borderTop);
    // services
    this.consoleService = new ConsoleService(version, this.isMaster, name);
    this.updater = new Updater(this);
    this.multiverse = multiverse;

    // servers
    this.gameServer = new GameServer(this.world, this.consoleService, this.configService , version, this.port, this.isMaster, this.name, banned, multiverse, gamemode);

    // configuration
    this.consoleService.setGameServer(this.gameServer);

  }


  /**
   * Inits the game server i.e. calls the updater and anything else that should run before we start the server.
   */
  init() {
    // Init updater
    this.updater.init();
  }

  /** 
   * Starts the control server which will start and monitor other servers
   */
  start() {

    this.consoleService.start();

    // Add command handler
    // todo breaking encapsulation
    this.gameServer.commands = this.consoleService.commands.list;

    // Run Ogar
    this.gameServer.init();
    this.gameServer.start();
  }


  /**
   * Shuts down the server. Depending on the reason it will restart if needed.
   * @param reason - restart, shutdown, update
   */
  stop(reason) {
    // todo ControlServer stop
this.gameServer.stop();
  }

  /**
   * Periodic control server task.
   */
  update() {

  }

  getWorld() {
    return this.world;
  }

  getConsoleService() {
    return this.consoleService;
  }



};

