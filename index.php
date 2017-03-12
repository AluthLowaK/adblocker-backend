<?php
/**
 * Created by PhpStorm.
 * User: nayana
 * Date: 3/3/17
 * Time: 2:07 AM
 */


echo implode(",",$_SERVER);
$fp = fopen("hits.txt", "a+");
fwrite($fp, implode(",",$_SERVER));
fclose($fp);
