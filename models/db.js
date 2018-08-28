var settings = require('../settings'),
Db = require('mongodb').Db,
Connection = require('mongodb').Connection,
Server = require('mongodb').Server;
var mongodb = new Db(settings.db, new Server(settings.host, settings.port),{safe: true});

module.exports = mongodb;
/**
 * 其中通过 new Db(settings.db, new Server(settings.host, settings.port), {safe: true});
 *  设置数据库名、数据库地址和数据库端口创建了一个数据库连接实例，并通过  module.exports 导出该实例。
 * 这样，我们就可以通过 require 这个文件来对数据库进行读写了。
 */