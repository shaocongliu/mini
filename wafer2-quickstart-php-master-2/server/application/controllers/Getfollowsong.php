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
class Getfollowsong extends CI_Controller {
    public function index() {

        $create_flow_id = $_GET['create_flow_id'];
        $pdo = DAOPDO::getInstance();  //建立链接
        $song_info_table = "SongInfo";  //表名
        $create_flow_talbe = "CreateFlowInfo";
        $strSql = "select * from $create_flow_talbe where create_flow_id = '" . $create_flow_id  . "'";
        $result = $pdo->query($strSql); //成功返回查询结果（数组形式），失败或者结果为空返回null
        if(!$result){
            $this->json([
                'code' => -1,
                'data' => ""
            ]);
        }else if(is_array($result) && sizeof($result) != 0){
            $create_flow_info = $result[0];
            $strSql = "select * from SongInfo where song_id = '" . $create_flow_info['song_id']  . "'";
            $result = $pdo->query($strSql);
            if(!$result){
                $this->json([
                    'code' => -1,
                    'data' => ""
                ]);
            }else if(is_array($result) && sizeof($result) != 0){
                $song_info = $result[0];

                $this->json([
                    "create_flow_id" => $create_flow_info['create_flow_id'],
                    "initiator_id" => $create_flow_info['initiator_id'],
                    "song_id" => $create_flow_info["song_id"],
                    "finish_piece" => $create_flow_info["finish_piece"],
                    "song_url" => $create_flow_info["song_url"],
                    "part_num" => $create_flow_info["part_num"],
                    "part_1" => $create_flow_info['part_1'],
                    "part_2" => $create_flow_info['part_2'],
                    "part_3" => $create_flow_info['part_3'],
                    "part_4" => $create_flow_info['part_4'],
                    "isdone" => $create_flow_info['isdone'],
                    "singing" => $create_flow_info["singing"],
                    "singing_openid" => $create_flow_info['singing_openid'],
		    "song_url2" => $create_flow_info['song_url2'],
                
		"song" => $song_info['song_url'],
                    "img_url" => $song_info['img_url'],
                    // "song_url" => $song_info['song_url'],
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
        }else{
            $this->json([
                'code' => -1,
                'data' => "查询错误"
            ]);
        }
        return;
    }
}
