<?php
defined('BASEPATH') OR exit('No direct script access allowed');

//引入访问数据库的文件 ConDB.class.php
include dirname(__FILE__) . '/../business/ConDB.class.php';

/**
 * 获取歌曲列表
 */
class GetSongList extends CI_Controller {
    public function index() {
        $pdo = DAOPDO::getInstance();  //建立链接
        $table = "Songinfo";  //表名
        
        //查询示例
        $strSql = "select * from" . $table;
        $result = $pdo->query($strSql); //成功返回查询结果（数组形式），失败或者结果为空返回null

        $code = 0;
        if(!$result)
        {
            $code = -1;
        }

        $this->json([
            'code' => $code,
            'data' => [
                'msg' => $result
            ]
        ]);
    }
}