<?php
defined('BASEPATH') OR exit('No direct script access allowed');


//引入访问数据库的文件 ConDB.class.php
include dirname(__FILE__) . '/../business/ConDB.class.php';

/**
 * 获取合唱链的信息（获取各种状态：未完成，正在有人唱，已完成）
 */
class Getsongstate extends CI_Controller {
    public function index() {
        
        $my_singsongid = $_GET['singsongid'];
        $my_userid = $_GET['openid'];

        $pdo = DAOPDO::getInstance();  //建立链接
        $table = "CreateFlowInfo";  //表名

        //查询示例
        $strSql = "select * from CreateFlowInfo where create_flow_id = '" . $my_singsongid."'";
        $result = $pdo->query($strSql); //成功返回查询结果（数组形式），失败或者结果为空返回null

        if ($result == null){
            $this->json([
                'result' => 'failed'
            ]);
            return;
        }
        else if (is_array($result) && empty($result)){
            $this->json([
                'result' => 'failed'
            ]);
            return;
        }

        if ($result[0]['isdone'] != 0){
            $this->json([
                'result' => 'success',
                'isdone' => 1,
                'url' => $result[0]['song_url']
            ]);
            return;
        }

        $this->json([
            'result' => 'success',
            'isdone' => $result[0]['isdone'],
            'singing' => $result[0]['singing'],
            'who' =>  $result[0]['singing_openid'],
        ]);
    }
}
