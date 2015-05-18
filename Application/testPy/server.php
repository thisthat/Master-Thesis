<?php

$db_name = "access";
$db_user = "root";
$db_pass = "root";

$db = mysql_connect("127.0.0.1", $db_user, $db_pass);
mysql_select_db($db_name);

$sql = "UPDATE accessCounter SET number = number +1 WHERE ID = 1";
mysql_query($sql);