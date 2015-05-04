<?php

$dir = "./";
$exts = ['arff'];

function ext($file){
    $e = explode('.',$file);
    return $e[count($e) - 1];
}

if(file_exists ( './merge.arff' )){
    unlink('./merge.arff' );
}
$dir = opendir($dir);
$first = true;
$out = "";
while (false !== ($file = readdir($dir))) {
    if(!in_array(ext($file), $exts)){
        continue;
    }
    $h = fopen($file,'r');
    $cnt = fread($h, filesize($file));
    if($first){
        $first = false;
        $out = $cnt;
    } else {
        $exp = explode("@data", $cnt);
        $out .= $exp[1];
    }
    fclose($h);
}

$write = fopen("merge.arff", 'w+');
fwrite($write, $out);
fclose($write);
echo "Merge done!";

?>