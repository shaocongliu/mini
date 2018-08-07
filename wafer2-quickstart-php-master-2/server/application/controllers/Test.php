<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Test extends CI_Controller {
    public function index() {
        $mydata = $_GET['key'];
        $music_url = '123';
        $music_line_num = '123';
        $piece_num = '123';
        $time1 = '1';
        $time2 = '2';
        $time3 = '3';
        $this->json([
            'music_url' => $music_url,
            'lyrics' => [
                'lyrics_lines' => $music_line_num,
                'lyrics_pieces_info' => [
                    'piece_num' => $piece_num,
                    'piece_time' => [
                        $time1, $time2, $time3
                    ]
                ]
            ]
        ]);
    }
}