<?php
/**
 * Wafer php demo 配置文件
 */

$fuck = [
    'rootPath' => '',

    // 微信小程序 AppID
    'appId' => 'wx5672d7cc1a26c076',

    // 微信小程序 AppSecret
    'appSecret' => '',

    // 使用腾讯云代理登录
    'useQcloudLogin' => true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 AppID
     */
    'mysql' => [
        'host' => '172.16.0.6',
        'port' => 3306,
        'user' => 'test',
        'db'   => 'cAuth',
        'pass' => 'test', //wx00dd65d70f19dcec
        'char' => 'utf8mb4'
    ],

    'cos' => [
        /**
         * 区域
         * 上海：cn-east
         * 广州：cn-sorth
         * 北京：cn-north
         * 广州二区：cn-south-2
         * 成都：cn-southwest
         * 新加坡：sg
         * @see https://www.qcloud.com/document/product/436/6224
         */
        'region' => 'cn-sorth-4',
        // Bucket 名称
        'fileBucket' => 'wafer',
        // 文件夹
        'uploadFolder' => ''
    ],

    // 微信登录态有效期
    'wxLoginExpires' => 7200,
    'wxMessageToken' => 'abcdefgh',
    
    'serverHost' => 'www.jemizhang.cn',
    'tunnelServerUrl' => 'http://tunnel.ws.qcloud.la',
    'tunnelSignatureKey' => '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
    // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    'qcloudAppId' => 1200000000,// 必须是数字
    'qcloudSecretId' => 'AKIDKXYO3aw9OVRGybz9dTFpCSn284nJ6hCW',
    'qcloudSecretKey' => 'RksnW3PDzd5LSVM1Tp48zmOo14e6LTSA',
    'networkTimeout' => 30000
];
