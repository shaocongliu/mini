<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * 获取歌曲接力上传的所有信息
 */

//引入访问数据库的文件 ConDB.class.php
include dirname(__FILE__) . '/../business/ConDB.class.php';

/**
 * /Getonesong?songid=songid
 */
class Getonesong extends CI_Controller {
    public function index() {

        $song_name = $_GET["song_name"];
        $pdo = DAOPDO::getInstance();  //建立链接
        $table = "SongInfo";  //表名
        $strSql = "select * from $table where song_name = '" . $song_name . "'";
        $result = $pdo->query($strSql); //成功返回查询结果（数组形式），失败或者结果为空返回null
        if(!$result){
            $this->json([
                'code' => -1,
                'data' => $song_name
            ]);
        }else if(is_array($result) && sizeof($result) != 0){
            $song_info = $result[0];
            $this->json([
                "song_id" => $song_info['song_id'],
                "img_url" => $song_info['img_url'],
                "song_url" => $song_info['song_url'],
                "lyric_url" => $song_info['lyric_url'],
                "song_name" => $song_info['song_name'],
                "singer" => $song_info['singer'],
                "song_duration" => $song_info['song_duration'],
                "song_piece_num" => $song_info['song_piece_num'],
                "lyric_info" => $song_info['lyric_info']
            ]);
        }else{
            $this->json([
                'code' => -1,
                'data' => "查询错误"
            ]);
        }
        return;
    }
}