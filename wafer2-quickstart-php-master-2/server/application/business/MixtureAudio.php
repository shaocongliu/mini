<?php

function MixtureAudio($song_url, $m_song_url, $offset,$create_id){
    $path = "/root/pycode/pydubDemo/";
    $output_path = "/data/release/php-demo/upload/" . $create_id . ".mp3";
    $cmd_str = "/usr/bin/python " . $path ."audioCenter.py ". $song_url . " " . $m_song_url ." " . $offset . " " . $output_path;
    //$result = shell_exec($cmd_str);
    $ret = system($cmd_str);
    //exec($cmd_str.'2>&1', $out, $return_val);
    return "http://www.jemizhang.cn/upload/" . $create_id . ".mp3".$ret;
}
