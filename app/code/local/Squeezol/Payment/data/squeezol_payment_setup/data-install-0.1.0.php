<?php

$data = array(
    array(
        'param_key' => 'username',
        'param_val' => 'alfietto91',
        'store_id'  => Mage_Core_Model_App::ADMIN_STORE_ID
    ),

    array(
        'param_key' => 'secret',
        'param_val' => 'jnusin2357b6vka1u997ss12',
        'store_id'  => Mage_Core_Model_App::ADMIN_STORE_ID
    )
);

foreach ($data as $d) {
    Mage::getModel('squeezol_payment/params')
          ->addData($d)
          ->setStoreId($d['store_id'])
          ->save();
}
