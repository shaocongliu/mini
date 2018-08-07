<?php
defined('BASEPATH') OR exit('No direct script access allowed');


//引入访问数据库的文件 ConDB.class.php
include dirname(__FILE__) . '/../business/ConDB.class.php';

class Startsinging extends CI_Controller {
    public function index() {

        $m_singsongid = $_GET['singsongid'];
        $m_userid = $_GET['openid'];

        $create_flow_info = null;
        
        $pdo = DAOPDO::getInstance();  //建立链接
        $table = "CreateFlowInfo";  //表名

        // 
        $strSql = "select * from $table where create_flow_id = '". $m_singsongid . "'";
        $result = $pdo->query($strSql); //成功返回查询结果（数组形式），失败或者结果为空返回null
        if ($result == null){
            $this->json([
                'result' => 'create_flow_id does not exist.'
            ]);
            return;
        }
        else if (is_array($result)){
            $create_flow_info = $result[0];
        }
        
        if ($create_flow_info == null)
        {
            $this->json([
                'result' => 'select db error',
            ]);
            return;
        }


        $state = 0; //创作流未完成
        $singing = 0; //没人正在唱

        if ($create_flow_info['isdone'] != 0){
            //创作流已完成
            $this->json([
                'result' => 'done',
                'url' => $create_flow_info['song_url']
            ]);
	    return;
        }
        else if($create_flow_info['isdone'] == 0 && $create_flow_info['singing'] == 0){
            //仍然未完成,当前没人在唱，下一个人可以唱来

            $arrayDataValue = array("singing" => 1, "singing_openid" => $m_userid);
            $where = " create_flow_id = ".$m_singsongid;
            $result = $pdo->update($table, $arrayDataValue, $where); //返回修改的行数

            $this->json([
                'result' => 'success',
            ]);
        }
        else if($create_flow_info['isdone'] == 0 && $create_flow_info['singing'] != 0){
            //仍然未完成,当前有人在唱
            $table = "UserInfo";
            $sqlstr = "select * from $table where open_id='" . $create_flow_info['singing_openid'] . "'";
            $result = $pdo->query($sqlstr);
            $who = "匿名";
            if($result && is_array($result) && sizeof($result) != 0)
            {
                $who = $result[0]['open_id'];
            }
            $this->json([
                'result' => 'singing',
                'who' => $who,
                'img_url' => $result[0]['img_url']
            ]);
        }
        else {
            $this->json([
                'result' => 'error',
            ]);
            return;
        }
    }
}
