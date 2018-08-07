<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Conf as Conf;

//引入访问数据库的文件 ConDB.class.php
include dirname(__FILE__) . '/../business/ConDB.class.php';

// include dirname(__FILE__).'/../../config.php';

class Login extends CI_Controller {
    public function index() {
        // Conf::setup($config);
        $result = LoginService::login();
        


        if ($result['loginState'] === Constants::S_AUTH) {
            $this->json([
                'code' => 0,
                'data' => $result['userinfo']
            ]);

            $pdo = DAOPDO::getInstance();  //建立链接
            $table = "UserInfo";  //表名
            // $time = date(‘y-m-d h:i:s’,time());

            $myresult = json_decode(json_encode($result['userinfo']['userinfo']), true);
            $strSql = "select * from $table where open_id='" . $myresult['openId'] . "'";
            // $strSql = "SELECT * FROM UserInfo WHERE open_id = '1'";
            
            $mycode = $pdo->query($strSql); //成功返回查询
            if(!$mycode || (is_array($mycode) && sizeof($mycode) == 0)){
                $arrayDataValue = array("open_id"=>$myresult['openId'], "nick_name"=> $myresult['nickName'], "gender"=> $myresult['gender'], "img_url"=> $myresult['avatarUrl'] );  //要插入的各个字段（字段名=>字段值）
                // $arrayDataValue = array("open_id"=>"1", "nick_name"=> "2", "gender"=> "2", "img_url"=> "2321" );  //要插入的各个字段（字段名=>字段值）
                $result = $pdo->insert($table, $arrayDataValue);  //执行插入语句，成功返回1，错误返回0
                if($result == 0){
                    $this->json([
                        'code' => '-1',
                        'error' => 'sql insert error'
                    ]);
                }
            }
        } else {
            $this->json([
                'code' => -1,
                'error' => $result['error']
            ]);
        }
    }
}
