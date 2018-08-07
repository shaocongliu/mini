<?php
defined('BASEPATH') OR exit('No direct script access allowed');


//引入访问数据库的文件 ConDB.class.php
include dirname(__FILE__) . '/../business/ConDB.class.php';
include dirname(__FILE__) . '/../business/MixtureAudio.php';
include dirname(__FILE__) . '/../business/download.php';


class Changesongstate extends CI_Controller {
    public function index() {

        $m_singsongid = $_GET['singsongid'];
        $m_userid = $_GET['openid'];
        $m_piece_num = $_GET['piece_num'];
        $m_song_url = $_GET['song_url'];

        $pre_url = ""; // 上一个半成品的url，如果是第一段就是伴奏的url

        $create_flow_info = null;
        // song_url 是接力者上传的音频，需要与伴奏合成
        // 音频合成后需要修改数据库中的url和创作流状态
        
        $pdo = DAOPDO::getInstance();  //建立链接
        $table = "CreateFlowInfo";  //表名

        // 查询半成品url
        $strSql = "select * from $table where create_flow_id = '". $m_singsongid ."'";
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
        
        if ($create_flow_info == null){
            $this->json([
                'result' => 'select db error',
            ]);
            return;
        }

        $create_id = $result[0]['create_flow_id'];
	$url = "";
        try{
            $strsql = "select * from SongInfo where song_id='" . $result[0]['song_id'] . "'";
            $myresult = $pdo->query($strsql);
            if($myresult && is_array($myresult) && sizeof($myresult) != 0){
                $str = $myresult[0]['lyric_info'];
                $str = substr($str, 0, strlen($str)-1);
                $str = substr($str, 1, strlen($str));
                $myarr = explode(",", $str);
                $start_time = $myarr[0 + 4 * $m_piece_num];
		$url = $myresult[0]['song_url'];
            }
        }catch (Exception $e) {
            $this->json([
                'result' => "err",
                'error' => $e->__toString()
            ]);
        }

        // pre_url: 伴奏， m_song_url：音频，需要合成这两个音频
        // 返回合成后的url
        //TODO下载文件
        // $url = $create_flow_info['song_url']; // http://www.jemizhang.cn/upload/xxxx.m4a
        // $filename = "banzou" . $create_id . ".mp3";
        // $save_dir = "/data/release/php-demo/upload/" . $filename;
        // $create_flow_file = getFile($url, $save_dir, $filename, 1);



	if ( $result[0]['song_url'] == null ){

            $arrayDataValue = array("song_url" => $m_song_url);
            $where = "create_flow_id = '".$m_singsongid . "'";
            $result = $pdo->update($table, $arrayDataValue, $where); //返回修改的行数

	}else{

            $arrayDataValue = array("song_url2" => $m_song_url);
            $where = "create_flow_id = '".$m_singsongid . "'";
            $result = $pdo->update($table, $arrayDataValue, $where); //返回修改的行数
	
		$this->json([
			'result' => 'success',
			'isdone' => 1,
			'url' => $url,
			'url2' => $m_song_url,
			'url1' => $result[0]['song_url']
		]);	
		return;
	}

        //更新示例

        $this->json([
            'result' => 'success',
            'isdone' => 0
        ]);
    }
}
