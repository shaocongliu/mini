<?php
defined('BASEPATH') OR exit('No direct script access allowed');

//引入访问数据库的文件 ConDB.class.php
include dirname(__FILE__) . '/../business/ConDB.class.php';

/**
 * 搜索歌曲byName
 */

class Searchsongbyname extends CI_Controller {
    public function index() {
        $song_name = $_GET["song_name"];
        $pdo = DAOPDO::getInstance();  //建立链接
        $table = "SongInfo";  //表名
        $strSql = "select * from $table where song_name like '%$song_name%' ";
        //查询示例
        // $strSql = "select * from " . $table;
        $result = $pdo->query($strSql); //成功返回查询结果（数组形式），失败或者结果为空返回null
        $song_num = sizeof($result);
        if(!$result){
            $this->json([
                "song_num" => 0,
                "songs" => []
            ]);
        }else{
            $song_list = "";
            foreach($result as $onesong){
                $id = $onesong['song_id'];
                $name = $onesong['song_name'];
                $singer = $onesong['singer'];
                $song_list .= "{
                    'id' => $id,
                    'name' => $name,
                    'singer' => $singer
                },";
            }
            $song_list = substr($song_list, 0, strlen($song_list)-2);
            $this->json([
                "song_num" => $song_num,
                "songs" => [$song_list]
            ]);
        }
    }
}