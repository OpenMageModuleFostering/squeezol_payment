<?php

class Squeezol_Payment_Model_Mysql4_Params_Collection extends Mage_Core_Model_Mysql4_Collection_Abstract {
    public function __construct () {
        $this->_init('squeezol_payment/params');
        parent::__construct();
    }
}
