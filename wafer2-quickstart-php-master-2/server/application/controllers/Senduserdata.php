<?php


include_once "wxBizDataCrypt.php";




class Senduserdata extends CI_Controller {
    public function index() {
        
        $my_appid = $_POST['appid'];
        $my_sessionKey = $_POST['sessionKey'];
        $my_encryptedData = $_POST['encryptedData'];
        $my_iv = $_POST['iv'];

        $pc = new WXBizDataCrypt($appid, $sessionKey);
        $errCode = $pc->decryptData($encryptedData, $iv, $data );

        if ($errCode == 0) {
            print($data . "\n");
            $this->json([
                'result' => 'success'
            ]);

            



        } else {
            print($errCode . "\n");
            $this->json([
                'result' => 'failed'
            ]);
        }
    }
}

