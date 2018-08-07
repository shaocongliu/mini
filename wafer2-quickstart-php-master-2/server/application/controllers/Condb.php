<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * 访问数据库示例
 * @author jacozhang
 * @version 1.0
 */


//引入访问数据库的文件 ConDB.class.php
include dirname(__FILE__) . '/../business/ConDB.class.php';

class Condb extends CI_Controller {
    public function index() {

        $pdo = DAOPDO::getInstance();  //建立链接
        $table = "test";  //表名
        // $time = date(‘y-m-d h:i:s’,time());
        //插入示例
        // $arrayDataValue = array("id"=>1, "name"=>"jaco");  //要插入的各个字段（字段名=>字段值）
        // $result = $pdo->insert($table, $arrayDataValue);  //执行插入语句，成功返回1，错误返回0

        // //查询示例
        $strSql = "select * from test";
        $result = $pdo->query($strSql); //成功返回查询结果（数组形式），失败或者结果为空返回null

        // //更新示例
        // $arrayDataValue = array("name" => "jaco12138");
        // $where = 'id=1';
        // $result = $pdo->update($table, $arrayDataValue, $where); //返回修改的行数

        // //删除示例
        // $where = 'id=1';
        // $result = $pdo->delete($table, $where);  //返回删除行数

        //TODO 根据查询结果处理业务逻辑然后将结果返回
        //将最终结果返回给前台
        $this->json([
            'code' => 0,
            'data' => [
                'msg' => "hello world",
                'req' => $result
            ]
        ]);
        }


}
