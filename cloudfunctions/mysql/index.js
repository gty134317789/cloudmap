// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入mysql操作模块
const mysql = require('mysql2/promise')
cloud.init()
// 云函数入口函数
exports.main = async(event, context) => {
  //链接mysql数据库的mapdarta库，可以链接你mysql中的任意库
  try {
    const connection = await mysql.createConnection({
      host: "sh-cynosdbmysql-grp-faa8ph9w.sql.tencentcdb.com",
      port:"21552",
      database: "mapdata",
      user: "root",
      password: "dsj2021_"
    })
    //大小受限，筛选0-5000个数据
    const [rows, fields] = await connection.execute(' SELECT * FROM jd3 order by f1 desc limit 0,5000;')
    return rows;
  } catch (err) {
    console.log("连接错误", err)
    return err
  }
}//云函数模块