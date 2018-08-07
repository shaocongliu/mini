<?php
defined('BASEPATH') OR exit('No direct script access allowed');


//引入访问数据库的文件 ConDB.class.php
include dirname(__FILE__) . '/../business/ConDB.class.php';



class Createsingsong extends CI_Controller {
    public function index() {

        $m_songid = $_GET["songid"];
        $m_openid = $_GET["openid"];
        $m_curtim = time();

        $part_num = $_GET["piece_num"]; 

        $m_key = $m_songid."-".$m_openid."-".$m_curtim;

        $pdo = DAOPDO::getInstance();  //建立链接
        $table = "CreateFlowInfo";  //表名



        $strSql = "select * from SongInfo where song_id = '". $m_songid ."'";
        $result = $pdo->query($strSql); //成功返回查询结果（数组形式），失败或者结果为空返回null
        if ($result == null){
            $this->json([
                'result' => 'song_id does not exist.'
            ]);
            return;
        }
        else if (is_array($result) && empty($result)){
            $this->json([
                'result' => 'song_id does not exist.'
            ]);
            return;
        }

        $m_songurl = $result[0]['song_url'];

        $arrayDataValue = array("create_flow_id" => $m_key, 
                                "initiator_id" => $m_openid, 
                                "song_id" => $m_songid,
                                "finish_piece" => 0,
                                "song_url" => "",
                                "part_num" => $part_num,
                                "isdone" => 0,
                                "singing" => 0
                            );

        $result = $pdo->insert($table, $arrayDataValue);  //执行插入语句，成功返回1，错误返回0
        if ($result != 1){
            // 数据库插入失败
            $this->json([
                'result' => 'create flow id insert failed'
            ]);
            return;
        }
        
        $this->json([
            'result' => 'success',
            'createflowid' => $m_key
        ]);
    }
}
