<?php
    $aImage = $_FILES['logphoto'];
    $sTmpName = $aImage['tmp_name'];

    $sDir = "uploads";
    $sNewFile = "Upload_".date("YmdHis").".png";

    $sFilePath = $sDir."/".$sNewFile;
    file_put_contents($sFilePath, file_get_contents($sTmpName));

    // $sNewFile => Database Varchar
    // print_r($sTmpName);
?>